const Notification = require("./NotificationSchema");

const addNotification = async (req, res) => {
  try {
    const { notification } = req.body;
    const msg = new Notification({ notification });
    await msg.save();
    res
      .status(200)
      .json({ success: true, message: "Notification saved successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = {addNotification, getNotification};
