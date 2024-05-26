// VehicleController.js
const Vehicle = require("../../model/VehicleSchema");

const addVehicle = async (req, res) => {
  try {
    const { category, unique_id } = req.body;

    if (!category || !unique_id) {
      return res.status(400).json({
        success: false,
        message: "Category and unique ID are required",
      });
    }

    // Check if there is any existing vehicle with the same unique_id in the same category
    const existingVehicle = await Vehicle.findOne({
       
      category,
      unique_id,
    }).exec();
    console.log(existingVehicle)
   

    if (existingVehicle) {
      console.log(existingVehicle);
      return res.status(400).json({
        success: false,
        message: "Vehicle with this unique ID already exists in this category",
        existingVehicle, // Optionally return the existing vehicle information
      });
    }

    if(existingVehicle === " " || null){
      console.log("hello")

    }

    // If no existing vehicle found, create a new vehicle
    const newVehicle = new Vehicle({ category, unique_id });

    // Save the new vehicle to the database
    await newVehicle.save();

    // Respond with success message and the newly created vehicle
    res.status(200).json({
      success: true,
      message: "Vehicle added successfully",
      newVehicle,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ success: false, message: error.message });
  }
};


const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.find();
    res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const vehicleController = {
  addVehicle,
  getVehicle,
  updateVehicle,
};

module.exports = vehicleController;
