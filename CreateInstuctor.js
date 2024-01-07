const User = require("./model/userSchema");

const CreateInstructor = async (req, res)=>{
    const {firstName, lastName, email, password}= req.body;
    
}

module.exports = CreateInstructor;