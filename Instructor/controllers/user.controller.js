const User = require("../../model/userSchema");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const sendEmail = require("../../utils/email.utils");
const jwt = require("jsonwebtoken");
const Enrollment = require("../../model/EnrollmentSchema");

//to register
const register = async (req, res) => {
  // register the users
  try {
    console.log(req.body);
    const { email, firstName, lastName, password, contactNumber } = req.body;
    console.log(email, firstName, lastName, password, contactNumber);

    if (!email || !firstName || !lastName || !password || !contactNumber) {
      return res.status(401).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email ",
      });
    }
    const contactNumberRegex = /^[6-9]\d{9}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      return res.status(401).json({
        success: false,
        message: "Invalid contact number",
      });
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(401).json({
        success: false,
        message:
          "Password must contain atleast one uppercase, one lowercase, one digit and one special character",
      });
    }

    const user = await User.findOne({ email });
    console.log(user);

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      role: "user",
      firstname: firstName,
      lastname: lastName,
      password: hashedPassword,
      contactnumber: contactNumber,
    });
    await newUser.save();

    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error registering new user please try again." });
  }
};

//to login
const login = async (req, res) => {
  // to login
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res
        .status(404)
        .json({ error: "User not verified, Please verify your email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password not valid" });
    }

    const userPayload = { email: user.email, role: user.role, id: user._id };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET);
    // console.log(accessToken);

    return res.status(200).json({
      message: "Login successfull",
      email: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      id: user._id,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

//to send the otp
const sentOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { verificationCode: otp },
      { new: true }
    );
    await sendEmail(
      updatedUser.verificationCode,
      "Verification otp from DriveSync",
      "Your OTP is",
      `<h1>Please enter your otp code for verifying your account</h1>
      <p>Your otp is ${otp}</p>`,
      email
    );
    res.status(200).json({
      message: "Otp has been sent to your email",
      // user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while sending otp",
    });
  }
};

//to verify the otp
const verifyOtp = async (req, res) => {
  console.log(req.body);
  try {
    const { email, verificationCode } = req.body;
    // console.log(email, verificationCode);
    const user = await User.findOne({ email, verificationCode });
    // console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }

    user.isVerified = true;
    await user.save();
    // console.log(user);
    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while verifying otp",
    });
  }
};

// to show the user's list in the admin table
const Users = async (req, res) => {
  try {
    // Get the list of users
    const users = await User.find(
      { role: "user" },
      { email: 1, firstname: 1, lastname: 1, contactnumber: 1, _id: 1 }
    );

    // Iterate over each user and check if they are enrolled in any course
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // Find course enrollments for the current user
      const courseEnrollments = await Enrollment.find({ user: user._id });

      // If user has any course enrollments, set enrolled to true; otherwise, set it to false
      user.enrolled = courseEnrollments.length > 0;
    }

    // Send the response
    return res.json(users);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: "Internal server error" });
  }
};

// to show the user information for the edit portion of admin's student table
const getUserById = async (req, res) => {
  // to dispplay the information for edit  of admin student table
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    console.log(user);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// to edit the student details from the admin profile
const editStudentDetails = async (req, res) => {
  const userId = req.params.id;
  const allowedFields = ["firstname", "lastname", "email", "contactnumber"]; // Define allowed fields

  try {
    // Find the user by ID in the database
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only allowed fields present in the request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Save the updated user information to the database
    user = await user.save();

    // Return the updated user information in the response
    return res.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

//to delete the user
const deleteUser = async (req, res) => {
  // for the delete user of admin student table
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Error deleting user" });
  }
};

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Constructing the reset link with email as a query parameter
    const link = `http://localhost:3000/Resetpassword/?email=${encodeURIComponent(
      email
    )}`;

    // Update user's link field
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { link: link },
      { new: true }
    );

    // Send reset link via email
    await sendResetLink(
      updatedUser.link,
      "Reset Password from DriveSync",
      "Please click the link to reset your password",
      email
    );

    res.status(200).json({
      message: "Reset link has been sent to your email",
    });
  } catch (error) {
    console.error("Error while sending reset link:", error); // Log the specific error
    res.status(400).json({
      message: "Error while sending reset link",
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const {  newPassword } = req.body;
    const { email } = req.query;
    console.log(email)
    console.log(req.body)

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Error resetting password",
    });
  }
};

const userController = {
  register,
  login,
  sentOtp,
  verifyOtp,
  Users,
  getUserById,
  editStudentDetails,
  deleteUser,
  ForgetPassword,
  ResetPassword,
};
module.exports = userController;
