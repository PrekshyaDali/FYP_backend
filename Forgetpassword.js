const User = require("./model/userSchema");
const sendEmail = require("./email.utils");
const sendResetLink = require("./reset.utils");

const ForgetPassword = async (req, res) => {    
    try{
    const { email } = req.body;
    const user =await User.findOne({ email });
    const link = "http://localhost:3000/Resetpassword/"
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { link: link },
      { new: true }
    );
    if(!user){
        return res.status(400).json({
            message: "User not found"
        })
    }
    await sendResetLink(
      updatedUser.link,
      "Reset Password from DriveSync",
      "Please click the link to reset your password",
      email
    );

    res.status(200).json({
        message: "Reset link has been sent to your email"
    })
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            message: "Error while sending reset link"
        })
    }
}

module.exports = ForgetPassword;