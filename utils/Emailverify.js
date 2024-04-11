// const User = require("../model/userSchema");
// const sendEmail = require("./email.utils");

// const verifyOtp = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { email, verificationCode } = req.body;
//     // console.log(email, verificationCode);
//     const user = await User.findOne({ email, verificationCode });
//     // console.log(user);
//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid otp",
//       });
//     }

//     user.isVerified = true;
//     await user.save();
//     // console.log(user);
//     res.status(200).json({
//       message: "User verified successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Error while verifying otp",
//     });
//   }
// };
// module.exports = verifyOtp;
