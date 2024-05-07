const router = require("express").Router();
const vehicleController = require("../controllers/vehicles.contollers");

router.post("/addVehicle", vehicleController.addVehicle);

module.exports = router;