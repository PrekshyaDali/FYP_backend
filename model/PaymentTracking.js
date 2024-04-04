const Payment = require("./PaymentSchema");
const Enrollment = require("./EnrollmentSchema");

const PaymentTracking = async (req, res) => {
  const { paymentType, paidAmount, enrollmentId } = req.body;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    const packageAmount = enrollment.price;
    const dueAmount = packageAmount - paidAmount;
    const payment = new Payment({
      paymentType,
      paidAmount,
      dueAmount,
      enrollment: enrollmentId,
    });
    await payment.save();
    return res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

module.exports = PaymentTracking;
