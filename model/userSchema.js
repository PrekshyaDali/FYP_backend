const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    contactnumber: {
      type: Number,
      required: true,
      minlength: 10,
    },

    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },
    verificationCode: {
      type: String,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: true,
      default: "default",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
    },
    emergencycontactnumber: {
      type: Number,
      minlength: 10,
    },

    dob: {
      type: Date,
    },

    isFirstLogin: {
      type: Boolean,

      default: false,
    },
    image: {
      type: Object,
      
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId, // Use Schema from Mongoose
      ref: "Enrollment",
   
    },
    enrolled:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
