
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database facing connection issue");
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDb };
