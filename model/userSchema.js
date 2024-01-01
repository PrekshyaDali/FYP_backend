const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true,
        minlength: 8

    },
  
    contactnumber:{
        type: Number,
        required: true,
        minlength: 10
   
    },
    
    role:{
        type:String,
        enum: ['user', 'admin', 'instructor'],
        default: 'user'
    
    },
    verificationCode:{
        type: String,
        required: true,
        default: false
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    link:{
        type: String,
        required: true,
        default: 'default'
    }
    
},
    {
        timestamps: true
    }
)


 const User = mongoose.model ('User',userSchema)

 module.exports = User