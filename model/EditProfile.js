const User = require("../model/userSchema");

const EditProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    // Extract fields from req.body
    const {
      email,
      contactnumber,
      emergencycontactnumber,
      dob,
      gender,
      firstname,
      lastname,
      address,
    } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);

    // If user is not found, return an error response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    user.email = email;
    user.contactnumber = contactnumber;
    user.emergencycontactnumber = emergencycontactnumber;
    user.dob = dob;
    user.gender = gender;
    user.firstname = firstname;
    user.lastname = lastname;
    user.address = address;
    console.log(req.file, user.image);
    // Check if there is a file in the request
    if (req.file) {
      // Assuming the file is an image
      // Update the user's image field with the filename
      user.image = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email format",
      });
    }
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    // Validate date of birth format
    if (!dobRegex.test(dob)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth format",
      });
    }

    // Validate contact number format
    const contactNumberRegex = /^(98|96|97)[1-9]\d{7}$/;
    if (!contactNumberRegex.test(contactnumber)) {
      console.log(
        "Invalid contact number format",
        "contactnumber",
        contactnumber
      );
      return res.status(400).json({
        success: false,
        message: "Invalid contact number format",
      });
    }

    const emergencyContactNumberRegex = /^(98|96|97)[6-9]\d{7}$/;
    // Validate emergency contact number format
    if (!emergencyContactNumberRegex.test(emergencycontactnumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid emergency contact number format",
      });
    }

    // Validate gender
    const genderRegex = /^(male|female|others)$/;
    if (!genderRegex.test(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender option",
      });
    }

    // Save the updated user information to the database
    user = await user.save();

    // Return the updated user information in the response
    return res.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

module.exports = EditProfile;
