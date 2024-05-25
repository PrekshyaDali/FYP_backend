const router = require("express").Router();
const financeController = require("../controllers/finances.controller");

router.get("/getFinanceData", financeController.getFinanceData);
router.get("/getFilteredFinances", financeController.getFilteredFinances);


module.exports = router;