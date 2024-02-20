const mongoose = require("mongoose");


const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
    min: 1000000000,
    max: 9999999999,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  hodVerified: {
    type: Boolean,
    default: false,
  },
   otp: {
    type: String, 
  },
  otpExpiration: {
    type: Date, 
  },
});

module.exports = mongoose.model("admin", adminSchema);
