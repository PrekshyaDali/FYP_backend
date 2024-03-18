const Enrollment = require("../model/EnrollmentSchema");
const mongoose = require("mongoose");
const sendEmail = require("../Otp/email.utils");

const userEnrollment = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      contactnumber,
      email,
      category,
      emergencycontactnumber,
      duration,
      price,
      address,
      gender,
      payment,
      startdate,
      courseId,
      userId,
    } = req.body;
    console.log(req.body);
    if (
      !firstname ||
      !lastname ||
      !contactnumber ||
      !email ||
      !category ||
      !emergencycontactnumber ||
      !duration ||
      !price ||
      !address ||
      !gender ||
      !payment ||
      !startdate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const newEnrollment = new Enrollment({
      firstname,
      lastname,
      contactnumber,
      email,
      category,
      emergencycontactnumber,
      duration,
      price,
      gender,
      address,
      payment,
      startdate,
      course: courseId,
      user: userId,
    });
    await newEnrollment.save();
    res.status(201).json({ success: true, message: "Enrollment successful" });
    console.log(newEnrollment);
    await sendEmail(
      "Enrollment successful",
      "Enrollment successful",
      "Your enrollment has been successful",
      email
    );
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const enrollments = await Enrollment.findOne({ email: userEmail });
    console.log(enrollments, "enrollments");
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const getEnrollmentById = async (req, res) => {
//   try {
//     const enrollmentId = req.params.id;

//     const enrollments = await Enrollment.findById(enrollmentId);
//     console.log(enrollments, "enrollments");
//     res.status(200).json({ success: true, data: enrollments });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getEnrollmentById = async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from request parameters

    // Find the enrollment document that matches the user's ID
    const enrollment = await Enrollment.findOne({ user: userId });

    if (enrollment) {
      // If enrollment is found, send the enrollment data in the response
      return res.status(200).json({ success: true, data: enrollment });
    } else {
      // If no enrollment is found for the user, send a 404 Not Found response
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found for the user" });
    }
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateEnrollment = async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const updateFields = req.body; // Assuming updated fields are passed in the request body

    // Use updateOne to update the enrollment document
    const result = await Enrollment.updateOne(
      { _id: enrollmentId },
      { $set: updateFields }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { userEnrollment, getEnrollment, updateEnrollment , getEnrollmentById};
