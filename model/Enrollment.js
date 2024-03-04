const Enrollment = require("../model/EnrollmentSchema");
const mongoose = require("mongoose");

const userEnrollment = async(req, res)=>{
    try{
    const{firstname, lastname, contactnumber, email, category, emergencycontact, duration, price, address,gender, payment} = req.body;
    if (!firstname || !lastname || !contactnumber || !email ||  !category || !emergencycontact || !duration || !price || !address  || !gender || !payment){
        return res.status(400).json({success: false, message: "Please fill all the fields"});
    }
    const newEnrollment = new Enrollment({
        firstname,
        lastname,
        contactnumber,
        email,
        category,
        emergencycontact,
        duration,
        price,
        gender,
        address,
        payment
    })
    await newEnrollment.save();
    res.status(201).json({success:true, message: "Enrollment successful"});
    console.log(newEnrollment);

} catch(error){
    console.log(error);
    res.status(500).json({success: false,  message: error.message});

}

}
module.exports = userEnrollment;