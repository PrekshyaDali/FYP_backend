const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EsewaSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrollment: {},
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Esewa", EsewaSchema);
