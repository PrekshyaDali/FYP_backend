const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomizeCourseSchema = new Schema({
  thresholdDays: { type: Number, required: true },
  discountPercent: { type: Number, required: true },
  category: { type: String, required: true, enum: ["car", "bike", "scooter"], unique: true},
  basePricePerDay: { type: Number, required: true },
    
  maxDiscount: { type: Number, required: true },
});

module.exports = mongoose.model("CustomizeCourse", CustomizeCourseSchema);
