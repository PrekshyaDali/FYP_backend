const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");
const AddCourses = async (req, res) => {
  try {
    const { courseOverview, certification, courseDuration, price, type } =
      req.body;
    const newCourse = new Course({
        courseOverview,
        certification,
        courseDuration,
        price,
        type,
        
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
    console.log(savedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't create course" });
  }
};
module.exports = AddCourses;
