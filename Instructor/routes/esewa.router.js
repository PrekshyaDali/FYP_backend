const router = require('express').Router();

const esewaControllers = require('../controllers/esewa.controllers');

router.post("/esewa", esewaControllers.paymentEsewa);
router.get("/Khalti/:userId", esewaControllers.getPaymentKhalti);

module.exports = router;

