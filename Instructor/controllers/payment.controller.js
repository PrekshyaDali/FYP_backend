const Payment = require("../../model/PaymentSchema");
const Enrollment = require("../../model/EnrollmentSchema");

const PaymentTracking = async (req, res) => {
  const { paymentType, paidAmount, enrollmentId } = req.body;
  
  try {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Initialize remainingAmount to packageAmount if not already set
    if (enrollment.remainingAmount === null) {
      enrollment.remainingAmount = enrollment.price;
    }

    // Calculate dueAmount
    let dueAmount = enrollment.remainingAmount - paidAmount;
    console.log(dueAmount);

    // Ensure dueAmount doesn't go negative
    if (dueAmount < 0) {
      return res
        .status(400)
        .json({ error: "Paid amount exceeds remaining amount in enrollment " });
    }

    // Create new payment
    const payment = new Payment({
      paymentType,
      paidAmount,
      dueAmount,
      enrollment: enrollmentId,
    });

    // Update remainingAmount
    enrollment.remainingAmount = dueAmount;

    // Save enrollment
    await enrollment.save();

    // Save payment
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

const getPaymentData = async (req, res) => {
  const { enrollmentId } = req.params;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    const payments = await Payment.find({ enrollment: enrollmentId });
    return res.status(200).json({ payments });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const paymentController = {
  PaymentTracking,
  getPaymentData,
}
module.exports = paymentController;
