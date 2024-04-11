const Notification = require("./NotificationSchema");
const moment = require("moment-timezone");
const sendEmail = require("../utils/email.utils");
const nodemailer = require("nodemailer");
const User = require("../model/userSchema");

EMAIL = "prekshyashrestha0@gmail.com";
PASSWORD = "iwcl jjga kfgi ozog";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const addNotification = async (req, res) => {
  try {
    const { notification } = req.body;
    const nepaliTime = moment.tz(Date.now(), "Asia/Kathmandu").format();
    const msg = new Notification({ notification, date: nepaliTime });
    await msg.save();

    // Fetch all existing users
    const users = await User.find();

    // Loop through each user and send email
    users.forEach(async (user) => {
      const formattedDate = moment(nepaliTime).format("YYYY-MM-DD hh:mm:ss A");
      // Prepare HTML content for the email
      const htmlContent = `
        <p>Dear ${user.firstname},</p>
        <p>${notification}</p>
        <div>
          <p>Regards,</p>
          <p>Drive Sync</p>
        </div>
      `;
      // Send email to the user
      await sendEmail(
        null,
        "DriveSync",
        "Your message here",
        htmlContent,
        user.email
      );
    });

    res.status(200).json({
      success: true,
      message: "Notification saved successfully",
      notification,
      date: nepaliTime,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = { addNotification, getNotification };
