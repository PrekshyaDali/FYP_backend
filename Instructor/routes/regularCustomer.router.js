const router = require("express").Router();
const regularCustomersController = require("../controllers/regularCustomers.controllers");

router.post(
  "/regularCustomerTracking",
  regularCustomersController.regularCustomerTracking
);
router.get(
  "/getRegularCustomer",
  regularCustomersController.getRegularCustomer
);

module.exports = router;
