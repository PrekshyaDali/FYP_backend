const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/sendotp", userController.sentOtp);
router.post("/verifyotp", userController.verifyOtp);
router.get("/users", userController.Users);// to show the user's list in the admin table
router.get("/users/:id", userController.getUserById);// to show the user information for the edit portion of admin's student table
router.put("/edit/:id", userController.editStudentDetails)
router.delete("/user/:id", userController.deleteUser)

module.exports = router;
