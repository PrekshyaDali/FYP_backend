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

const sendEmail = async (password, subject, text, to) => {
  try {
    const mailOptions = {
      from: EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: `
            <h1>You have requested a one-time password  for your account. Please find your password below:</h1
            <p>Your password is ${password}</p>
            <p>For security reasons, it is important to change your password immediately after logging in. Use the provided OTP to log in and navigate to your account settings to set a new password.</p>

            `,
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
