const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");

const Courses = async (req, res) => {
  const CourseData = req.body;

  try {
    if (!Array.isArray(CourseData.title) || CourseData.title.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "There are no courses." });
    }

    const CoursesPromises = CourseData.title.map(async (title, index) => {
      const description = CourseData.description[index] || ""; // Ensure description is available

      if (!title || !description) {
        return res.status(400).json({
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
      message: "Created Courses Successfully",
      createdCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Couldn't create course" });
  }
};

module.exports = Courses;
