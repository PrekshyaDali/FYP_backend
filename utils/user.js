// const User = require("../model/userSchema");
// const sendEmail = require("./email.utils");

// const sentOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const updatedUser = await User.findByIdAndUpdate(
//       user._id,
//       { verificationCode: otp },
//       { new: true }
//     );
//     await sendEmail(
//       updatedUser.verificationCode,
//       "Verification otp from DriveSync",
//       "Your OTP is",
//       `<h1>Please enter your otp code for verifying your account</h1>
//       <p>Your otp is ${otp}</p>`,
//       email
//     );
//     res.status(200).json({
//       message: "Otp has been sent to your email",
//       // user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Error while sending otp",
//     });
//   }
// };










// module.exports = sentOtp;
