const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    // status: {
    //     type: String,
    //     enum: ["present", "absent"],
    // },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // course: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Course",
    //     required: true,
    // },
    enrollment: {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
        required: true,
    },
    });
module.exports = mongoose.model("Attendance", AttendanceSchema);
