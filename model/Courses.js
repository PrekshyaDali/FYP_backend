const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");

const Courses = async (req, res) => {
  const CourseData = req.body;
  try {
    if (!CourseData || CourseData.length < 0) {
      res.status(201).json({ success: false, message: "There is no Courses " });
    }

    const CoursesPromises = CourseData.map(async ({ title, description }) => {
      if (!title || !description) {
        res.status(201).json({
          success: false,
          message: "All fields are required for each course",
        });
      }

      const newCourse = new Course({
        title,
        description,
      });
      return newCourse.save();
    });
    const createdCourse = await Promise.all(CoursesPromises);
    res.status(201).json({
      message: "Created Courses Successsfully",
      createdCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't create course" });
  }
};

module.exports = Courses;
