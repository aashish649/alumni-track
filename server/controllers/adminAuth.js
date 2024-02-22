const bcrypt = require("bcrypt");
const Admin = require("../models/adminmodel.js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/emailSer.js");
const Faq = require("../models/faQ.js");
const User = require("../models/user.js");
const nodemailer = require("nodemailer");
const Notice = require("../models/notice.js");
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const twilio = require("twilio");



dotenv.config();

const adminSignup = async (req, res) => {
  try {
    const { name, email, mobileNo, password } = req.body;

    const existingAdmin = await Admin.findOne({ mobileNo });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Validate password complexity
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long with one uppercase letter, one lowercase letter, and one digit",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email: email.toLowerCase(),
      mobileNo: parseInt(mobileNo),
      password: hashedPassword,
      isVerified: false,
      hodVerified: false,
    });

    // Generate a verification token
    const verificationToken = jwt.sign(
      { mobileNo: newAdmin.mobileNo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const emailSent = await sendVerificationEmail(
      newAdmin.mobileNo,
      verificationToken
    );

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message:
          "Admin registered successfully.Email sent successfuly. Wait for admin approval to login.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error in sending verification mail",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Admin cannot be registered, Please try again later",
      details: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { mobileNo, verificationToken } = req.params;
    console.log("Received mobile number:", mobileNo);
    console.log("Received verification token:", verificationToken);

    
    jwt.verify(
      verificationToken,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("Error verifying token:", err);
          return res.status(400).json({
            success: false,
            message: "Invalid token",
          });
        }

        console.log("Decoded Token:", decoded);

        const admin = await Admin.findOne({ mobileNo: parseInt(mobileNo) });

        if (!admin) {
          return res.status(404).json({
            success: false,
            message: "Admin not found",
          });
        }

        if (admin.isVerified) {
          return res.status(400).json({
            success: false,
            message: "Admin is already verified",
          });
        }

        admin.isVerified = true;
        admin.hodVerified = true;

       
        await admin.save();

        return res.status(200).json({
          success: true,
          message: "Admin signup approved successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error in verifyEmail function", error.message);
    return res.status(500).json({
      success: false,
      message: "Error in verifying email",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { mobileNo, password } = req.body;

    if (!mobileNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    const admin = await Admin.findOne({ mobileNo });

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "You are not registered! Please register yourself",
      });
    }

    if (!admin.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Email not verified.Please verify your email first to login as an admin",
      });
    }

    if (!admin.hodVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Admin not verified by HOD. Please wait for HOD approval to login.",
      });
    }

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign(
        { adminId: admin._id, mobileNo },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      admin.token = token;
      admin.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        admin,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Mobile number or password is incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Can't login, please try again later",
    });
  }
};

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const phone_Number = process.env.PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (mobileNumber, otp, res) => {
  try {
    console.log(`Sending OTP: ${otp} to +91${mobileNumber}`);
    await client.messages.create({
      body: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`,
      from: `+1${phone_Number}`,
      to: `+91${mobileNumber}`,
    });

    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
    });
  } catch (error) {
    console.error("Error in sending OTP", error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const resetAdminPass = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(401).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const admin = await Admin.findOne({ mobileNo: mobileNumber });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    const otp = generateOTP();

    await Admin.updateOne(
      { _id: admin._id },
      { otp, otpExpiration: new Date(Date.now() + 600000) }
    );

    await sendOtp(mobileNumber, otp, res); 

    
  } catch (error) {
    console.error(error);

   
    return res.status(500).json({
      success: false,
      message: "Error in sending Otp",
    });
  }
};


const verifyOtp = async (req,res) => {
  try {
    const {mobileNumber,otp} = req.body;
    const MobileNumber = parseInt(mobileNumber,10);
    const admin = await Admin.findOne({mobileNo:MobileNumber,otp, otpExpiration: { $gt: new Date() },});
    console.log("Received request to verify OTP:", mobileNumber, otp);

    if(!admin){
      return res.status(401).json({
        success:false,
        message:"Admin not found with this credentials",
      });
    }

    res.status(200).json({
      success:true,
      message:"Otp verified successfullly",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Error in verifying",
    });
  }
};

const changeAdminPass = async (req,res) => {
  try {
    const {mobileNumber,newPassword} = req.body;

    const admin = await Admin.findOne({mobileNo:mobileNumber});

    if(!admin){
      return res.status(401).json({
        success:false,
        message:"Admin not found",
      });
    }
    if(!newPassword){
      return res.status(401).json({
        success:false,
        message:"Password is required",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);

    await Admin.updateOne({_id:admin._id},{password:hashedPassword,otp:undefined, otpExpiration: undefined });

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

const Adminlogout = async (req, res) => {
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

const adminLoggedIn = (req, res) => {
  try {
    // Check for the token in headers
    const tokenFromHeaders =
      req.headers.authorization &&
      req.headers.authorization.replace("Bearer ", "");
    // Check for the token in cookies
    const tokenFromCookies = req.cookies.token;
    // Check for the token in request body
    const tokenFromBody = req.body.token;
    // Choose the first non-empty token
    const token = tokenFromHeaders || tokenFromCookies || tokenFromBody;

    if (!token) {
      return res.json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("test this ", decode.adminId);

    if (!decode.adminId) {
      return res.json({
        success: false,
        message: "Invalid user identity",
      });
    }

    return res.json({
      success: true,
      user: decode,
      message: "Admin is logged in",
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

const unanswered = async (req, res) => {
  try {
    const notansweredques = await Faq.find({
      answer: { $exists: false },
    }).populate("user", "name rollNo");
    res.json(notansweredques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const answer = async (req, res) => {
  try {
    const { q_id } = req.params;
    const { answer } = req.body;

    const updateanswer = await Faq.findByIdAndUpdate(
      q_id,
      { answer },
      { new: true }
    );
    res.json(updateanswer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { q_id } = req.params;
    await Faq.findByIdAndDelete(q_id);
    return res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const searchAdmin = async (req, res) => {
  try {
    const admin = req.admin;
    const searchUser = req.query.search;
    const branch = req.query.branch;

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

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
      users: userList,
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

const deleteUser = async (req, res) => {
  try {
    const admin = req.admin;
    const userId = req.params.user_id;

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const deleteuser = await User.findByIdAndDelete(userId);

    if (deleteuser) {
      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        deleteuser: deleteuser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (req, res) => {
  try {
    const { to, subject, text, from } = req.body;
    let userEmails = [];

    if (to === "all") {
      const users = await User.find({}, "email");
      userEmails = users.map((user) => user.email);
    } else {
      const user = await User.findOne({ email: to }, "email");
      if (user) {
        userEmails = [user.email];
      } else {
        return res.status(500).json({
          success: false,
          message: "User not found",
          error: error.message,
        });
      }
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmails.join(","),
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "pdfuploads"));
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const extension = path.extname(originalname);
    const uniqueFilename = `${Date.now()}${extension}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

const uploadNotice = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'PDF file is required',
      });
    }

    const pdfPath = path.join(__dirname, 'pdfuploads', req.file.filename);

    fs.renameSync(req.file.path, pdfPath);

    const newNotice = await Notice.create({
      title,
      content,
      pdf: {
        filename: req.file.filename,
        path:`pdfuploads/${req.file.filename}`,
      },
    });
    
    res.status(201).json({
      success: true,
      message: 'Notice uploaded successfully',
      notice: newNotice,
    });
    
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};







module.exports =  {
  adminSignup,
  verifyEmail,
  adminLogin,
  adminLoggedIn,
  Adminlogout,
  unanswered,
  answer,
  deleteQuestion,
  searchAdmin,
  deleteUser,
  sendMail,
  uploadNotice,
  upload,
  resetAdminPass,
  verifyOtp,
  changeAdminPass,
}
