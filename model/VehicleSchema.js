// VehiclesSchema.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["in use", "free"],
    default: "free",
  },
  unique_id: {
    type: String,
    required: true,
  },
});

// Compound index to ensure unique_id is unique within each category
VehicleSchema.index({ category: 1, unique_id: 1 }, { unique: true });

// Pre-save hook for custom validation
VehicleSchema.pre("save", async function (next) {
  const vehicle = this;
  const existingCount = await mongoose.models.Vehicle.countDocuments({
    category: vehicle.category,
    unique_id: vehicle.unique_id,
  });
  if (existingCount > 0) {
    return next(
      new Error(
        `Unique ID ${vehicle.unique_id} already exists for category ${vehicle.category}`
      )
    );
  }
  next();
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
