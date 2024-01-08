const User = require("../model/userSchema");
const sendEmail = require("./InstructorEmail");
const bcrypt = require("bcrypt");

const SendPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );
    console.log(updatedUser);
    await sendEmail(
      password,
      "One Time password from DriveSync",
      "Your One Time Password is",
      email
    );
    res.status(200).json({
      message: "Email sent Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while sending password",
    });
  }
};
module.exports = SendPassword;
