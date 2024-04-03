const Enrollment = require("./EnrollmentSchema");

const viewStudent = async (req, res) => {
  try {
    const { amount, dueAmount, category } = req.body;

    // Save the details to the database (assuming Enrollment.save() is correct)
    const enrollment = req.body;
    await enrollment.save({
      amount,
      dueAmount,
      category,
      // other relevant data from the request body
    });

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Payment saved successfully." });
  } catch (error) {
    // Return error response if an error occurs
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = viewStudent;
