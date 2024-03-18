const User = require("./model/userSchema");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

export const register = async (req, res) => {
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
