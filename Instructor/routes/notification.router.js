const router = require("express").Router();

const notificationController = require("../controllers/notifications.controller");

router.post("/addNotification", notificationController.addNotification);
router.get("/getNotification", notificationController.getNotification);

module.exports = router;