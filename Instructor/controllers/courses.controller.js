//

const Course = require("../../model/CourseSchema");
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

  if (courseDescription.length <= 100) {
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

const editCourses = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedFields = req.body;
    if (req.file) {
      updatedFields.image = `http://localhost:3001/uploads/${req.file.filename}`;
    }
    console.log(updatedFields, courseId);

    // Fetch the original course data to compare against for validation
    const originalCourse = await Course.findById(courseId);

    // Validate the updated fields against the same criteria as during creation
    validateInput(
      updatedFields.courseOverview || originalCourse.courseOverview,
      updatedFields.certification || originalCourse.certification,
      updatedFields.courseDuration || originalCourse.courseDuration,
      updatedFields.price || originalCourse.price,
      updatedFields.type || originalCourse.type,
      updatedFields.courseDescription || originalCourse.courseDescription,
      updatedFields.image || originalCourse.image
    );

    // Perform the update
    const result = await Course.findOneAndUpdate(
      { _id: courseId },
      updatedFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Couldn't update course", message: error.message });
  }
};

const getCourses =  async (req, res) => {
  // to get the courses in the student course section
  const courses = await Course.find();
  res.json(courses);
};


const getCoursesById =  async (req, res) => {
  // navigate to the course details page
  const { id } = req.params;
  const course = await Course.findById(id);
  res.json(course);
};

const courseController = {
  AddCourses,
  editCourses,
  getCourses,
  getCoursesById,
};
module.exports = courseController;
  