const User = require("../model/userSchema");

const EditProfile = async (req, res) => {
  const userId = req.params.id;
  // const allowedFields = [
  //   "firstname",
  //   "lastname",
  //   "email",
  //   "contactnumber",
  //   "dob",
  //   "emegencycontactnumber",
  //   "address",
  //   "gender",
  // ]; // Define allowed fields

  // try {
  //   // Find the user by ID in the database
  //   let user = await User.findById(userId);
  //   allowedFields.forEach((field) => {
  //     if (req.body[field] !== undefined) {
  //       user[field] = req.body[field];
  //     }
  //   });
  try {
    var   {
      email,
      contactnumber,
      emergencycontactnumber,
      dob,
      gender,
      firstname,
      lastname,
      address,
    } = req.body;

    // If user is not found, return an error esponse
    var user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
     user.email = email;
     user.contactnumber = contactnumber;
     user.emergencycontactnumber = emergencycontactnumber;
     user.dob = dob;
     user.gender = gender;
     user.firstname = firstname;
     user.lastname = lastname;
     user.address = address;

    // Update only allowed fields present in the request body

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email ",
      });
    }
    const contactNumberRegex = /^(98|96|97)[6-9]\d{7}$/;
    if (!contactNumberRegex.test(contactnumber)) {
      return res.status(401).json({
        success: false,
        message: "Invalid contact number",
      });
    }
    console.log(emergencycontactnumber);
    const emergencyContactNumberRegex = /^(98|96|97)[6-9]\d{7}$/;
    if (!emergencyContactNumberRegex.test(emergencycontactnumber)) {
      return res.status(401).json({
        success: false,
        message: "Invalid emergency contact number",
      });
    }

    // const dobRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
    // if (!dobRegex.test(dob)) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid dob",
    //   });
    // }

    const genderRegex = /^(male|female|others)$/;
    if (!genderRegex.test(gender)) {
      return res.status(401).json({
        success: false,
        message: "Invalid option",
      });
    }

    // Save the updated user information to the database
    user = await user.save();

    // Return the updated user information in the response
    return res.json(user); // Use `return` to ensure that no code executes after sending the response
  } catch (error) {
    // console.log(user);
    console.error("Failed to update user:", error);
    return res.status(500).json({ error: "Failed to update user" });
    console.log(error);
  }
};

module.exports = EditProfile;
