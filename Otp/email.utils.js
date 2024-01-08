
const nodemailer = require('nodemailer');

EMAIL = "prekshyashrestha0@gmail.com";
PASSWORD = "iwcl jjga kfgi ozog";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});
    
const sendEmail = async (otp, subject, text, to) => {
    try{
        const mailOptions = {
            from: EMAIL,
            to: to,
            subject: subject,
            text: text,
            html: `
            <h1>Please enter your otp code for verifying your account</h1>
            <p>Your otp is ${otp}</p>

            `
            

        };
        const result = await transporter.sendMail(mailOptions);
        console.log(result);
        }
        catch(error){
            console.log(error);
            res.status(400).json({
                message: "Error while sending email"
            })
        }

        
    }


   
    module.exports = sendEmail;