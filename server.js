const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/userSchema");
const sendOtp = require("./user");
const verifyOtp = require("./Emailverify");
const sendEmail = require("./email.utils");
sendResetLink = require("./reset.utils");
const ForgetPassword = require("./Forgetpassword");
require("dotenv").config();

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
    console.log(error);
    console.log("unable to connect to mongodb");
  });

//middleware
app.use(bodyParser.json());
app.use(cors());

//routes
//User Registration
//Post register
app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    const userPayload = { email: user.email, role: user.role };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET);

    return res
      .status(200)
      .json({
        message: "Login successfull",
        email: user.email,
        role: user.role,
        accessToken,
      });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.post("/sendotp", sendOtp);
app.post("/verifyotp", verifyOtp);
app.post("/ForgetPassword", ForgetPassword);

// Create //post request
// Read //get request
// Update //put or patch request
// Delete //delete request
