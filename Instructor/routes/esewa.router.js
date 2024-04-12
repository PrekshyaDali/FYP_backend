const router = require('express').Router();

const esewaControllers = require('../controllers/esewa.controllers');

router.post("/esewa", esewaControllers.paymentEsewa);

module.exports = router;

