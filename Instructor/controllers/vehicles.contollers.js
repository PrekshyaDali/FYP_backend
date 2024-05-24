const Vehicle = require("../../model/VehicesSchema");

const addVehicle = async (req, res) => {
  try {
    const { category, quantity } = req.body;
    const newVehicle = new Vehicle({
      category,
      quantity,
    });
    await newVehicle.save();
    res.status(200).json({
      success: true,
      message: "Vehicle added successfully",
      newVehicle,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.find();
    res.status(200).json({ message: "Vehicle fetched successfully", vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const vehicleController = {
  addVehicle,
  getVehicle,
};

module.exports = vehicleController;
