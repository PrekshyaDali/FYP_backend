// 

const Course = require("../model/CourseSchema");
const mongoose = require("mongoose");

const validateInput = (
  courseOverview,
  certification,
  courseDuration,
  price,
  type,
  courseDescription
) => {
  // Example regex for price: Allow only positive integers or decimals with up to 2 decimal places
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  // Regex for only numbers (positive integers)
  const numberRegex = /^\d+$/;

  // Check if courseOverview has more than 70 characters
  if (courseOverview.length > 70) {
    throw new Error("Course overview should not exceed 70 characters.");
  }

  // Check if courseDescription has more than 200 characters
  if (courseDescription.length > 200) {
    throw new Error("Course description should not exceed 200 characters.");
  }

  // Check if courseDuration contains only numbers
  if (!numberRegex.test(courseDuration)) {
    throw new Error("Course duration should be a numeric value.");
  }

  // Check if price is in valid format
  if (!priceRegex.test(price)) {
    throw new Error(
      "Invalid price format. Please provide a valid numeric value."
    );
  }

  // Add more validation checks for other fields if needed
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
    } = req.body;

    // Validate input
    validateInput(
      courseOverview,
      certification,
      courseDuration,
      price,
      type,
      courseDescription
    );

    const newCourse = new Course({
      courseOverview,
      certification,
      courseDuration,
      price,
      type,
      courseDescription,
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
