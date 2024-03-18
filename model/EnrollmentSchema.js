const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EnrollmentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactnumber: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  emergencycontactnumber: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  payment: {
    type: String,
    eum: ["esewa", "institute"],
  },
  startdate: {
    type: Date,
    default: Date.now,
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
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
module.exports = Enrollment;
