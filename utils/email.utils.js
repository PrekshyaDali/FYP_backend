const nodemailer = require("nodemailer");

EMAIL = "prekshyashrestha0@gmail.com";
PASSWORD = "iwcl jjga kfgi ozog";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const sendEmail = async (otp, subject, text, htmlContent, to) => {
  try {
    const mailOptions = {
      from: EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: htmlContent,
    };
    const result = await transporter.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while sending email",
    });
  }
};

module.exports = sendEmail;
