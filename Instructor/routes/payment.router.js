const router = require("express").Router();

const paymentController = require("../controllers/payment.controller");

router.post("/paymentTracking", paymentController.PaymentTracking);
router.get("/getPaymentData/:enrollmentId", paymentController.getPaymentData);

module.exports = router;