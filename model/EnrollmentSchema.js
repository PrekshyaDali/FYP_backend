const mongoose = require("mongoose");
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
  emergencycontact: {
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
  payment:{
    type : String,
    eum: ["esewa", "institute"],
  }
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
module.exports = Enrollment;
