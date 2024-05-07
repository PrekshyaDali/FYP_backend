const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FinanceSchema = new Schema({
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Finance", FinanceSchema);
