const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/userSchema");
const Course = require("./model/CourseSchema");
const sendOtp = require("./Otp/user");
const verifyOtp = require("./Otp/Emailverify");
const sendEmail = require("./Otp/email.utils");
sendResetLink = require("./reset.utils");
const ForgetPassword = require("./Forgetpassword");
const SendPassword = require("./Instructor/SendPassword.js");
const DashboardCount = require("./model/DashboardCount/DashboardCount.js");
const Search = require("./model/Search.js");
const Enrollment = require("./model/EnrollmentSchema");
const PaymentTracking = require("./model/PaymentTracking.js");
const {
  userEnrollment,
  getEnrollment,
  updateEnrollment,
  getEnrollmentById,
  countEnrollment,
  oneEnrollmentUser,
} = require("./model/Enrollment");
const { editCourses, AddCourses } = require("./model/Addcourses.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AuthGuard = require("./middleware");
const Editprofile = require("./model/EditProfile.js");

// const addCourses = require("./model/Addcourses.js");
const multerMiddleware = require("./model/multerMiddleware.js");
const {
  Attendancetracking,
  getAttendance,
} = require("./model/AttendanceTracking.js");
// const validationMiddleware = require("./model/validator.js");
require("dotenv").config();
// const routes  = require('./model/routes.js');

const SECRET_KEY = "secretkey";
//connect to express app
const app = express();

//connect to mongodb

const dbURI =
  "mongodb+srv://prekshyashrestha0:Prekshya123@cluster30.3wueix0.mongodb.net/DriveSync?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3001);
    console.log("server is connected to port 3001 and connected to mongodb");
  })
  .catch((error) => {
    console.log("unable to connect to mongodb");
  });

//middleware
app.use(bodyParser.json());
app.use(cors());

const checkAdmin = async () => {
  // check if the admin exists or not
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists");
      return;
    }
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const newUser = new User({
        email: "admin@admin.com",
        role: "admin",
        firstname: "admin",
        lastname: "admin",
        password: hashedPassword,
        contactnumber: "1234567890",
        isVerified: true,
      });

      const created = await newUser.save();
      console.log(created);
    }
    res.status(201).json({ message: "Admin created Successfully" });
  } catch (error) {
    console.log(error);
  }
};

checkAdmin();

app.post("/register", async (req, res) => {
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
});

app.post("/registerInstructor", async (req, res) => {
  // to register instructor
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
      role: "instructor",
      firstname: firstName,
      lastname: lastName,
      password: hashedPassword,
      contactnumber: contactNumber,
      isVerified: true,
    });
    await newUser.save();

    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error registering new user please try again." });
  }
});

app.post("/login", async (req, res) => {
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
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get("/users", async (req, res) => {
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
});
app.get("/users/:id", async (req, res) => {
  // to dispplay the information for edit  of admin student table
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/edit/:id", async (req, res) => {
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
});

app.delete("/user/:id", async (req, res) => {
  // for the delete user of admin student table
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Error deleting user" });
  }
});

app.get("/instructors", async (req, res) => {
  // to get the instructor list of admin instructor table
  const instructors = await User.find(
    { role: "instructor" },
    { email: 1, firstname: 1, lastname: 1, contactnumber: 1, _id: 1 }
  );

  return res.json(instructors);
});

app.get(
  // to get the user details of user profile
  "/getUsers",
  AuthGuard(["user", "instructor", "admin"]),
  async (req, res) => {
    try {
      const userEmail = req.user.email;

      const user = await User.findOne({ email: userEmail }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User found",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error getting user" });
    }
  }
);

app.post(
  // to get the instructor change thier password for their first login
  "/getinstructors",
  AuthGuard(["user", "instructor", "admin"]),
  async (req, res) => {
    try {
      const instrutorEmail = req.user.email;
      const user = await User.findOne({ email: instrutorEmail }).select(
        "-password"
      );

      if (!user) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      const password = req.body.password;
      if (!password) {
        return res.status(401).json({ message: "Password is required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;

      user.isFirstLogin = true;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
        role: user.role,
        isFirstLogin: user.isFirstLogin,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error changing password" });
    }
  }
);

app.get("/courses", async (req, res) => {
  // to get the courses in the student course section
  const courses = await Course.find();
  res.json(courses);
});

app.get("/course/:id", async (req, res) => {
  // navigate to the course details page
  const { id } = req.params;
  const course = await Course.findById(id);
  res.json(course);
});

app.use(express.urlencoded({ extended: true }));
app.use(multerMiddleware);

app.post("/upload", (req, res) => {
  //to upload the img

  // Checking if req.file exists and its MIME type is jpg or png //Validation
  if (
    req.file &&
    (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png")
  ) {
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: `http://localhost:3001/uploads/${req.file.filename}`,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Only JPG and PNG files are accepted" });
  }
});

app.get("/uploads/:filename", async (req, res) => {
  //for fetching img for the courses
  try {
    const fileName = req.params.filename;
    //find the file in the uploads folder
    const file = await fs.promises.readFile(
      path.join(__dirname, "uploads", fileName)
    );

    res.status(200).send(file);
  } catch {
    console.log(error);
  }
});

app.post("/sendotp", sendOtp);
app.post("/verifyotp", verifyOtp);
app.post("/ForgetPassword", ForgetPassword);
app.post("/SendPassword", SendPassword);
app.get("/DashboardCount", DashboardCount);
app.post("/Search", Search);
app.put("/editProfile/:id", Editprofile);
app.post("/addCourses", AddCourses);
app.put("/editCourses/:id", editCourses);
app.post("/enrollment", userEnrollment);
// app.post("/enrollment", userEnrollment);
app.get(
  "/getEnrollment",
  AuthGuard(["user", "instructor", "admin"]),
  getEnrollment
);
app.get("/getEnrollmentId/:id", getEnrollmentById);
app.get("/oneEnrollmentUser/:enrollmentId", oneEnrollmentUser);
app.get("/countEnrollment", countEnrollment);
app.patch("/enrollment/:id", updateEnrollment);
app.post("/attendance", Attendancetracking);
app.get("/getAttendance/:enrollmentId", getAttendance);
app.post("/paymentTracking", PaymentTracking)



// Create //post request
// Read //get request
// Update //put or patch request
// Delete //delete request
