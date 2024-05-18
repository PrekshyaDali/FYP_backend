const moment = require("moment-timezone");
const Notification = require("../../model/NotificationSchema");
const User = require("../../model/userSchema");
const sendEmail = require("../../utils/email.utils");

const EMAIL = "example@gmail.com";
const PASSWORD = "your_password";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const addNotification = async (req, res) => {
  try {
    const { notification, expires_at } = req.body;

    const fullDateFormat = "YYYY-MM-DD hh:mm A"; // Include AM/PM

    // Get current time in Nepali timezone
    const createdDate = moment.tz("Asia/Kathmandu").format(fullDateFormat);

    const msg = new Notification({
      notification,
      created_at: moment(createdDate, fullDateFormat).toDate(), // With AM/PM
      expires_at: moment(expires_at, "YYYY-MM-DD").toDate(),
    });

    await msg.save();

    res.status(200).json({
      success: true,
      message: "Notification saved successfully",
      notification,
      created_at: createdDate,
      expires_at: expires_at,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const currentDate = moment.tz("Asia/Kathmandu").toDate(); // Get current date in Nepali timezone

    const notifications = await Notification.find({
      created_at: { $lte: currentDate },
      expires_at: { $gte: currentDate }, // Only get unexpired notifications
    }).sort({ created_at: -1 }); // Sort by most recent created_at

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNotificationByWeek = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const notifications = await Notification.find({
      created_at: { $gte: sevenDaysAgo },
    }).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



const showNotificationToAdmin = async (req, res) => {
  try {
    // Fetch all notifications sorted by creation date (most recent first)
    const notifications = await Notification.find().sort({ created_at: -1 });

    // Format created_at and expires_at with a specific date/time format
    const formattedNotifications = notifications.map((notification) => {
      return {
        ...notification.toObject(), // Convert Mongoose document to plain object
        created_at: moment
          .tz(notification.created_at, "Asia/Kathmandu")
          .format("YYYY-MM-DD hh:mm A"), // Include AM/PM
        expires_at: moment
          .tz(notification.expires_at, "Asia/Kathmandu")
          .format("YYYY-MM-DD"), // Format as YYYY-MM-DD
      };
    });

    res.status(200).json({ success: true, data: formattedNotifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const ids = req.body.ids; // Array of notification IDs to delete
    await Notification.deleteMany({ _id: { $in: ids } });
    res
      .status(200)
      .json({ success: true, message: "Notifications deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
const notificationController = {
  addNotification,
  getNotification,
  getNotificationByWeek,
  showNotificationToAdmin,
  deleteNotifications,
};
module.exports = notificationController;
