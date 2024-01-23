const User = require("../userSchema");
const DashboardCount = async (req, res) => {
  try {
    const user = await User.countDocuments({ role: "user" });
    const instructor = await User.countDocuments({ role: "instructor" });

    res.status(200).json({
      message: "Counted Successfully",
      user,
      instructor,
    });
    console.log(user);
    console.log(instructor);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while getting count",
    });
  }
};

module.exports = DashboardCount;
