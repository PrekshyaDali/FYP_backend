const moment = require("moment-timezone");
const Notification = require("../../model/NotificationSchema");
const User = require("../../model/userSchema");
const sendEmail = require("../../utils/email.utils");
const nodemailer = require("nodemailer");

const EMAIL = "example@gmail.com";
const PASSWORD = "your_password";

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
      expires_at: { $gte: currentDate },
    }).sort({ created_at: -1 });

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
    const notifications = await Notification.find().sort({ created_at: -1 });
    const formattedNotifications = notifications.map((notification) => ({
      ...notification.toObject(),
      created_at: moment
        .tz(notification.created_at, "Asia/Kathmandu")
        .format("YYYY-MM-DD hh:mm A"),
      expires_at: moment
        .tz(notification.expires_at, "Asia/Kathmandu")
        .format("YYYY-MM-DD"),
    }));

    res.status(200).json({ success: true, data: formattedNotifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log("Received IDs to delete:", ids);
    const result = await Notification.deleteMany({ _id: { $in: ids } });
    console.log("Deletion result:", result);
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
