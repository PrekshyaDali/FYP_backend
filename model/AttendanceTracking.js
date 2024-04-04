const Attendance = require("./AttendanceSchema");
const Enrollment = require("./EnrollmentSchema");

// Route handler for marking attendance and calculating remaining days
const Attendancetracking = async (req, res) => {
  try {
    const { userId, enrollmentId, date } = req.body;

    // Fetch the enrollment data to get the start date
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Count present days starting from enrollment start date
    const startDateObj = new Date(enrollment.startdate);
    const endDateObj = new Date(date);
    const presentDaysCount = await Attendance.countDocuments({
      user: userId,
      enrollment: enrollmentId,
      date: { $gte: startDateObj, $lte: endDateObj },
    });

    // Calculate remaining days (assuming course duration is 30 days)
    const courseDuration = 30;
    const remainingDays = courseDuration - presentDaysCount;

    // Check if remaining days are 0
    if (remainingDays === 0 || remainingDays < 0) {
      return res
        .status(403)
        .json({
          error: "Attendance cannot be recorded, course already completed",
        });
    }

    // Create new attendance record
    const attendance = new Attendance({
      user: userId,
      enrollment: enrollmentId,
      date: new Date(date),
    });

    // Save the attendance record to the database
    await attendance.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance,
      remainingDays,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    // Fetch the enrollment data to get the start date
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Fetch attendance data for the given enrollment
    const attendance = await Attendance.find({ enrollment: enrollmentId });

    // Calculate remaining days based on enrollment start date and current date
    const startDateObj = new Date(enrollment.startdate);
    const endDateObj = new Date();
    const presentDaysCount = await Attendance.countDocuments({
      enrollment: enrollmentId,
      date: { $gte: startDateObj, $lte: endDateObj },
    });
    const courseDuration = 30;
    const remainingDays = courseDuration - presentDaysCount;

    res.status(200).json({ attendance, remainingDays });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { Attendancetracking, getAttendance };
