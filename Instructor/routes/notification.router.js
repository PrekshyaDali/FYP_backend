const router = require("express").Router();

const notificationController = require("../controllers/notifications.controller");

router.post("/addNotification", notificationController.addNotification);
router.get("/getNotification", notificationController.getNotification);
router.get("/getNotificationByWeek", notificationController.getNotificationByWeek);
router.get("/showNotificationToAdmin", notificationController.showNotificationToAdmin);

module.exports = router;