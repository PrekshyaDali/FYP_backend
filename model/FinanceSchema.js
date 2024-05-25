const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FinanceSchema = new Schema({
  source: {
    type: String,
    enum: ["Khalti", "Regular Customer",  "Courses"],
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
    enum: ["Khalti", "Regular Customer", "In House"],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },




  // filterType:{
  //   type: String,
  //   enum: ["thisWeek", "thisMonth", "threeMonths", "custom"],
  // },
  // startDate:{
  //   type: Date,
  // },
  // endDate:{
  //   type: Date,
  // }
  
});
module.exports = mongoose.model("Finance", FinanceSchema);
