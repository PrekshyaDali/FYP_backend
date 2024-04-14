const router = require("express").Router();

const courseController = require("../controllers/courses.controller");

router.post("/addCourses", courseController.AddCourses);
router.put("/editCourses/:id", courseController.editCourses);
router.get("/courses", courseController.getCourses);
router.get("/course/:id", courseController.getCoursesById);
router.delete("/deleteCourse/:id", courseController.deleteCourse);

module.exports = router;