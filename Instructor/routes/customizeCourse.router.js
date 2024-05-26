const router = require("express").Router();
const customizeController = require("../controllers/customizeCourse.controller");

router.post("/customize", customizeController.addCustomizeCourseDetails);

router.get("/getCustomizeDetail", customizeController.getCustomizeDetail);

module.exports = router;