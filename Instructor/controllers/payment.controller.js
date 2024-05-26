const Payment = require("../../model/PaymentSchema");
const Enrollment = require("../../model/EnrollmentSchema");
const Finance = require("../../model/FinanceSchema");

const PaymentTracking = async (req, res) => {
  const { paidAmount, enrollmentId } = req.body;
  console.log(req.body)

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
      // paymentType,
      paidAmount,
      dueAmount,
      enrollment: enrollmentId,
    });
    const newFinance = new Finance({
      source: "Courses",
      amount: paidAmount,
      date: new Date(),
      customerName: "Demo",
      paymentMethod: "In House",
      status: "Paid",
    });
    await newFinance.save();

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
    // Fetch the enrollment to ensure it exists
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Fetch all payments associated with the enrollment
    const payments = await Payment.find({ enrollment: enrollmentId });

    // Update the payments with a derived field 'paymentType'
    const paymentsWithPaymentType = payments.map((payment) => {
      const paymentType = payment.dueAmount === 0 ? "complete" : "incomplete";
      return {
        ...payment.toObject(), // Converts mongoose document to plain object
        paymentType,
      };
    });

    // Return the payments with the derived 'paymentType'
    return res.status(200).json({ payments: paymentsWithPaymentType });
  } catch (error) {
    // Handle any errors during the request processing
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const paymentController = {
  PaymentTracking,
  getPaymentData,
};
module.exports = paymentController;
