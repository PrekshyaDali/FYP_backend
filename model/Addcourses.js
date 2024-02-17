//

const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");

const validateInput = (
  courseOverview,
  certification,
  courseDuration,
  price,
  type,
  courseDescription,
  image
) => {
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  const numberRegex = /^\d+$/;

  if (courseOverview.split(/\s+/).length >= 100) {
    throw new Error("Course overview should not exceed 100 words.");
  }

  if (courseDescription.length <= 250) {
    throw new Error(
      "Course description should be at least 250 characters long."
    );
  }

  if (!numberRegex.test(courseDuration)) {
    throw new Error("Course duration should be a numeric value.");
  }

  if (!priceRegex.test(price)) {
    throw new Error(
      "Invalid price format. Please provide a valid numeric value."
    );
  }
  if (image === null) {
    throw new Error("Please upload an image of the course.");
  }
};

const AddCourses = async (req, res) => {
  try {
    const {
      courseOverview,
      certification,
      courseDuration,
      price,
      type,
      courseDescription,
      image,
    } = req.body;

    // Validate input
    validateInput(
      courseOverview,
      certification,
      courseDuration,
      price,
      type,
      courseDescription,
      image
    );

    const newCourse = new Course({
      courseOverview,
      certification,
      courseDuration,
      price,
      type,
      courseDescription,
      image,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
    console.log(savedCourse);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Couldn't create course", message: error.message });
  }
};

module.exports = AddCourses;
