const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/userSchema");

const SECRET_KEY = "secretkey";
//connect to express app
const app = express();

//connect to mongodb
const dbURI =
  "mongodb+srv://prekshyashrestha0:Prekshya123@cluster30.3wueix0.mongodb.net/Usersdb?retryWrites=true&w=majority";
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
    res.status(201).json({ message: "User created Succesfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//get registered users
app.get("/profile", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
});

//get Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password not valid" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    return res.status(200).json({ message: "Login successfull", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Create //post request
// Read //get request
// Update //put or patch request
// Delete //delete request
