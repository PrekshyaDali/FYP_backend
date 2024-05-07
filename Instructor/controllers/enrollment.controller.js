const Enrollment = require("../../model/EnrollmentSchema");
const mongoose = require("mongoose");
const sendEmail = require("../../utils/email.utils");



// to enroll the user
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
      "We have recieved your enrollment, Enrollment!!!",
      "Enrollment successful",
      "Your enrollment has been successful",
    `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Enrollment Successful!</h2>
        <p style="color: #666;">Thank you for enrolling in our course. We're excited to have you on board!</p>
        <p style="color: #666;">If you have any questions, please contact us at any time.</p>
        <p style="color: #666; text-align: right;">
          Regards,<br />
          <strong style="color: #333;">DriveSync Team</strong>
        </p>
      </div>
    `,
      email
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//to get the enrollment details from the profile , token
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


//to get the enrollmnet details of the user by id for the view student
const getEnrollmentById = async (req, res) => {
  //to map the enrollment data of the user in view student
  try {
    const userId = req.params.id; // Extract user ID from request parameters

    // Find the enrollment document that matches the user's ID
    const enrollment = await Enrollment.find({ user: userId });

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


const oneEnrollmentUser = async (req, res) => {
  try {
    const enrollmentId = req.params.enrollmentId; // Extract enrollment ID from request parameters

    // Find the enrollment document that matches the enrollment ID
    const enrollment = await Enrollment.findById(enrollmentId);

    if (enrollment) {
      // If enrollment is found, send the enrollment data in the response
      return res.status(200).json({ success: true, data: enrollment });
    } else {
      // If no enrollment is found for the provided ID, send a 404 Not Found response
      return res.status(404).json({
        success: false,
        message: "Enrollment not found for the provided ID",
      });
    }
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const countEnrollment = async (req, res) => {
  try {
    const count = await Enrollment.countDocuments();
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

const enrollmentController = 
{
  userEnrollment,
  getEnrollment,
  updateEnrollment,
  getEnrollmentById,
  countEnrollment,
  oneEnrollmentUser,
};
module.exports = enrollmentController;
