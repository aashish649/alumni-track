const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
  },
  rollNo: {
      type: Number,
      required: true,
  },
  graduationYear: {
      type: Number,
      required: true,
  },
  mobileNo: {
      type: Number,
      required: true,
      min: 1000000000, // Minimum 10-digit number
      max: 9999999999, // Maximum 10-digit number
  },
  branch: {
      type: String,
      required: true,
      enum: [
          "Computer Science Engineering",
          "Civil Engineering",
          "Mechanical Engineering",
          "Electronics & Communication",
          "Electrical Engineering",
          "Msc Mathematics",
      ],
  },
  password: {
      type: String,
      required: true,
  },
  photo: {
      url: {
          type: String,
          default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
      filename: {
          type: String,
          default: "no-img",
      },
  },
  designation: String,
  organization: String,
  bio: String,
  token: {
      type: String,
  },
  post: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
      },
  ],
});


module.exports = mongoose.model("user", userSchema);
