const router = require("express").Router();
const enrollmentController = require("../controllers/enrollment.controller");
const AuthGuard = require("../../middlewares/middleware");

router.post("/enrollment", enrollmentController.userEnrollment);
router.get(
  "/getEnrollment",
  AuthGuard(["user", "instructor", "admin"]),
  enrollmentController.getEnrollment
);
router.get(
  "/getEnrollmentId/:id",
  enrollmentController.getEnrollmentById
);
router.get("/oneEnrollmentUser/:enrollmentId", enrollmentController.oneEnrollmentUser);
router.get("/countEnrollment", enrollmentController.countEnrollment);
router.patch("/enrollment/:id", enrollmentController.updateEnrollment);

module.exports = router;
