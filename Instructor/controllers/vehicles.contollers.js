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
const vehicleController = {
    addVehicle,
    };

module.exports = vehicleController;
