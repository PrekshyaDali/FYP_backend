const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PaymentSchema = new mongoose.Schema({
  // paymentType: {
  //   type: String,
  //   enum: ["Unpaid", "Half Payment", "Full Payment"],
  //   required: true,
  // },
  paidAmount: {
    type: Number,
    required: true,
  },
  dueAmount: {
    type: Number,
    required: true,
  },
  enrollment: {
    type: Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
