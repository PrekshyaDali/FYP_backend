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


module.exports = mongoose.model("Vehicle", VehicleSchema);
