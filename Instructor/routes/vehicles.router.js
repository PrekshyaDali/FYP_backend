const router = require("express").Router();
const vehicleController = require("../controllers/vehicles.contollers");

router.post("/addVehicle", vehicleController.addVehicle);
router.get("/getVehicle", vehicleController.getVehicle);

module.exports = router;