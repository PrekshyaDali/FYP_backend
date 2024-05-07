const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Vehicle = new Schema({
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", Vehicle);