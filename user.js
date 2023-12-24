const User = require("./model/userSchema");
const sendEmail = require("./email.utils");



const sentOtp = async (req, res) => {
    try{
        const {email} = req.body
        const user = await User.findOne({email})
        const otp = Math.floor(100000 + Math.random() * 900000)
        const updatedUser = await User.findByIdAndUpdate(user._id, {verificationCode: otp}, {new: true})
        await sendEmail(updatedUser.verificationCode, "Verification otp from DriveSync", "Your OTP is", email)

        

    }
    catch(error){
        console.log(error)
    }
}
module.exports = sentOtp