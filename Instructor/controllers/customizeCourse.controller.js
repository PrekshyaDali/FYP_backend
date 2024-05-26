const CustomizeCourse = require("../../model/CustomizeCourseSchema");

const addCustomizeCourseDetails = async (req, res) => {
  try {
    const {
      thresholdDays,
      discountPercent,
      category,
      basePricePerDay,
      maxDiscount,
    } = req.body;

    if (
      !thresholdDays ||
      !discountPercent ||
      !category ||
      !basePricePerDay ||
      !maxDiscount
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const filter = { category }; // Search for existing document with the same category
    const update = {
      thresholdDays: Number(thresholdDays),
      discountPercent: Number(discountPercent),
      basePricePerDay: Number(basePricePerDay),
      maxDiscount: Number(maxDiscount),
    };
    const options = {
      new: true, // Return the updated document
      upsert: true, // Create a new document if it doesn't exist
    };

    const newCustomizeCourse = await CustomizeCourse.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.status(200).json({
      success: true,
      message: "Customize Course details added/updated successfully",
      newCustomizeCourse,
    });
  } catch (error) {
    console.error("Error adding/updating the custom course:", error);
    res.status(500).json({
      success: false,
      message: "Error adding/updating the custom course",
      error: error.message,
    });
  }
};

const getCustomizeDetail = async(req, res)=>{
  try {
    const customizeCourse = await CustomizeCourse.find();
    if (!customizeCourse) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ customizeCourse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }

}



const customizeController = {
  addCustomizeCourseDetails,

  getCustomizeDetail,
};

module.exports = customizeController;
