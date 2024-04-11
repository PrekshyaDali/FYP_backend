const router = require("express").Router();

const attendanceController = require("../controllers/attendance.controller");
router.post("/attendance", attendanceController.Attendancetracking);
router.get("/getAttendance/:enrollmentId", attendanceController.getAttendance);

module.exports = router;