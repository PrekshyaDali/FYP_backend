const User = require("./model/userSchema");
const mongoose = require("mongoose");

const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while deleting user",
    });
  }
};

module.exports = DeleteUser;
