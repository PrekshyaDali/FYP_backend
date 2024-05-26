const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/userSchema");
const Course = require("./model/CourseSchema");
const morgan = require("morgan");

const sendEmail = require("./utils/email.utils.js");
sendResetLink = require("./reset.utils");

const SendPassword = require("./Instructor/SendPassword.js");
const DashboardCount = require("./model/DashboardCount/DashboardCount.js");
const Search = require("./model/Search.js");
const Enrollment = require("./model/EnrollmentSchema");
const userRouter = require("./Instructor/routes/user.router.js");
const enrollmentRouter = require("./Instructor/routes/enrollment.router.js");
const courseRouter = require("./Instructor/routes/courses.router.js");
const attendanceRouter = require("./Instructor/routes/attendance.router.js");
const paymentRouter = require("./Instructor/routes/payment.router.js");
const notificationRouter = require("./Instructor/routes/notification.router.js");
const esewaRouter = require("./Instructor/routes/esewa.router.js");
const regularCustomerRouter = require("./Instructor/routes/regularCustomer.router.js");
const vehicleRouter = require("./Instructor/routes/vehicles.router.js");
const financeRouter = require("./Instructor/routes/finances.router.js");
const customizeRouter = require("./Instructor/routes/customizeCourse.router.js");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const AuthGuard = require("./middlewares/middleware.js");
const Editprofile = require("./model/EditProfile.js");

// const addCourses = require("./model/Addcourses.js");
const multerMiddleware = require("./model/multerMiddleware.js");
const {
  Attendancetracking,
  getAttendance,
} = require("./Instructor/controllers/attendance.controller.js");

// const validationMiddleware = require("./model/validator.js");
require("dotenv").config();
// const routes  = require('./model/routes.js');

const SECRET_KEY = "secretkey";
//connect to express app
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(multerMiddleware);

//middleware
app.use(bodyParser.json());
app.use(cors());

app.use(userRouter);
app.use(enrollmentRouter);
app.use(courseRouter);
app.use(attendanceRouter);
app.use(paymentRouter);
app.use(notificationRouter);
app.use(esewaRouter);
app.use(regularCustomerRouter);
app.use(vehicleRouter);
app.use(financeRouter);
app.use(customizeRouter);

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

app.use(express.urlencoded({ extended: true }));

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
  } catch (error) {
    console.log(error);
  }
});

app.post("/SendPassword", SendPassword);
app.get("/DashboardCount", DashboardCount);
app.post("/Search", Search);
app.put("/editProfile/:id", Editprofile);
