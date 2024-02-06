const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");

const validateInput = (
  courseOverview,
  certification,
  courseDuration,
  price,
  type
) => {
  // Example regex for price: Allow only positive integers or decimals with up to 2 decimal places
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  // Add more regex patterns for other fields if needed

  if (!priceRegex.test(price)) {
    throw new Error(
      "Invalid price format. Please provide a valid numeric value."
    );
  }

  // Add more validation checks for other fields if needed
};

const AddCourses = async (req, res) => {
  try {
    const { courseOverview, certification, courseDuration, price, type } =
      req.body;

    // Validate input
    validateInput(courseOverview, certification, courseDuration, price, type);

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
    res
      .status(500)
      .json({ error: "Couldn't create course", message: error.message });
  }
};

module.exports = AddCourses;
