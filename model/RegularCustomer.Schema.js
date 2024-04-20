const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regularCustomerSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: String,
    enum: ["Car", "Bike", "Scooter"],
  },
});

const RegularCustomers = mongoose.model(
  "RegularCustomer",
  regularCustomerSchema
);

module.exports = RegularCustomers;
