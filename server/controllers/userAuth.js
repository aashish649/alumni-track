const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const Faq = require("../models/faQ.js");
const mongoose = require("mongoose");
const Notice = require("../models/notice.js");
const { join } = require('path');
dotenv.config();
const { uploadToCloudinary } = require("../utils/cloudinary.js");
const multer = require("multer");
const fs = require('fs');
const path = require('path');


// Login

const signup = async (req, res) => {
  try {
    const { name, rollNo, graduationYear, email, mobileNo, branch, password } = req.body;

    console.log("Received Request Body user:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Secure the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      rollNo: parseInt(rollNo),
      graduationYear: parseInt(graduationYear),
      email: email.toLowerCase(),
      mobileNo: parseInt(mobileNo),
      branch,
      password: hashedPassword,
    });

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const message = `Welcome to the Alumni Tracking System,
      Hello ${name} Congratulations on joining the Alumni Tracking System of National Institute Of Technology,Patna.We are thrilled to have you as part of our alumni community.`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to Alumni Tracking system",
        text: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      
      res.status(200).json({
        success: true,
        message: "Signed up successfully. Email sent successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error while sending mail",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    
    res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again later.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details correctly",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not registered! Please register yourself",
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Can't login, please try again later",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", "", { httpOnly: true, expires: new Date(0) });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Can't logout, please try again later",
    });
  }
};

const userloggedin = (req, res) => {
  try {
    const tokenFromHeaders =
      req.headers.authorization &&
      req.headers.authorization.replace("Bearer ", "");
    const tokenFromCookies = req.cookies.token;
    const tokenFromBody = req.body.token;
    const token = tokenFromHeaders || tokenFromCookies || tokenFromBody;

    if (!token) {
      return res.json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("test thhis ", decode.user_id);
    if (!decode.user_id) {
      return res.json({
        success: false,
        message: "Invalid user identity",
      });
    }
    return res.json({
      success: true,
      user: decode,
      message: "User is logged in",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const userlogged = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.user.user_id });
    console.log("User data", userData);
    res.json(userData);
  } catch (error) {
    console.error("Error fetching logged user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const userData = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated resetToken:", resetToken);
    await User.updateOne({ _id: user._id }, { token: resetToken });

    const updatedUser = await User.findOne({ _id: user._id });
    console.log("Updated User Document:", updatedUser);

    const resetLink = `https://alumni-track.vercel.app/forgotpassword/${user._id}/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailoptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Click ${resetLink} to reset your password. This link is valid for 1 hour.`,
    };

    await transporter.sendMail(mailoptions);

    res.status(201).json({
      success: true,
      message: "Password reset mail send successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in sending mail",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id, token: token });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User and token verified",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in veryfying user",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ _id: id, token: token });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: user._id },
      { password: hashedPassword, token: undefined }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in resetting password",
    });
  }
};

const cloudinaryUploadpro = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(extname)) {
      callback(null, true);
    } else {
      callback(new Error('Only image files (jpg, jpeg, png, gif, bmp) are allowed'));
    }
  },
});

const uploadProfileImage = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File not provided in the request.',
      });
    }

    const folderName = 'profile';
    let uploadAttempts = 3;

    while (uploadAttempts > 0) {
      try {
        console.log("Before Cloudinary upload");
        const upload = await uploadToCloudinary(req.file.buffer, folderName);
        console.log("After Cloudinary upload");

        const imageUrl = upload.secure_url;
        const imageFilename = upload.public_id;

        const user = await User.findByIdAndUpdate(
          user_id,
          {
            "photo.url": imageUrl,
            "photo.filename": imageFilename,
          },
          { new: true }
        );

        return res.status(201).json({
          success: true,
          message: 'Profile image uploaded successfully',
          user,
        });
      } catch (uploadError) {
        console.error(`Error during Cloudinary upload. Retrying... Attempts left: ${uploadAttempts - 1}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      uploadAttempts--;
    }

    return res.status(500).json({ success: false, error: 'Error uploading file to Cloudinary' });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



const updateProfile = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile update successfully",
    });
  } catch (error) {
    console.error("Error in updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const searchUser = req.query.search;
    const branch = req.query.branch;

    const conditions = [];

    if (searchUser) {
      conditions.push({
        $or: [
          { name: { $regex: new RegExp(searchUser, "i") } },
          { email: { $regex: new RegExp(searchUser, "i") } },
          { rollNo: !isNaN(searchUser) ? parseInt(searchUser) : undefined },
          {
            graduationYear: !isNaN(searchUser) ? Number(searchUser) : undefined,
          },
        ],
      });
    }

    if (branch) {
      conditions.push({ branch: { $eq: branch } });
    }

    if (conditions.length === 0 && (!searchUser || !branch)) {
      return res.status(400).json({
        success: false,
        message: "Please provide details to search an alumni.",
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const userList = await User.find(query);

    if (userList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Alumni not available with the provided credentials.",
      });
    }

    res.status(200).json({
      success: true,
      user: userList,
      message: "Search successfully done",
    });
  } catch (error) {
    console.log("Error in searching userdata", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const userData = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const askQuestion = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { question } = req.body;

    const user = await User.findById(user_id);

    const newFaq = await Faq.create({
      user: user,
      question: question,
    });
    await newFaq.populate("user", "_id name rollNo email");
    res.json(newFaq);
  } catch (error) {
    console.error("Error in askQuestion:", error.message);
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal server error",
    });
  }
};

const allques = async (req, res) => {
  try {
    const faqs = await Faq.find({ answer: { $exists: true } }).populate(
      "user",
      "name rollNo"
    );
    res.json(faqs);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const allnotice = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error("Error in fetching Notices", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const userPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.params.user_id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Can't change password, please try again later",
    });
  }
};

module.exports = {
  signup,
  login,
  userloggedin,
  userlogged,
  getUserData,
  logout,
 updateProfile,
  searchUser,
  getUser,
  userProfile,
  askQuestion,
  allques,
  allnotice,
  resetPassword,
  forgotPassword,
  changePassword,
  userPassword,
  uploadProfileImage,
  cloudinaryUploadpro,
};
