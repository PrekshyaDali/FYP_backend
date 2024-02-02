const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: true,
  // },
  // description: {
  //   type: String,
  //   required: true,
  // },

  courseOverview: {
    type: String,
    required: true,
  },
  courseDuration:{
    type: String,
    required: true,
  },
  

  certification: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["scooter", "bike", "car"],
  },
  // image: {
  //   type: String,
  //   required: true,
  // },
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
