const User = require("../model/userSchema");

const Search = async (req, res) => {
  try {
    const { firstname, lastname, contactnumber, email } = req.body;
    const user = await User.find({ firstname, lastname, contactnumber, email });
    if (user.length === 0) {
      return res.status(400).json({
        message: "No such data",
      });
    }
    res.status(200).json({
      message: "Data found",
      data: user,
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while searching data",
    });
  }
};

module.exports = Search;
