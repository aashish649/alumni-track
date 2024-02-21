const express = require("express");
const {
  signup,
  login,
  userloggedin,
  userlogged,
  logout,
  getUserData,
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
} = require("../controllers/userAuth.js");
const {
  adminSignup,
  adminLogin,
  adminLoggedIn,
  verifyEmail,
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
} = require("../controllers/adminAuth.js");
const { authUser } = require("../middlewares/authUserMiddle.js");
const { authAdmin } = require("../middlewares/authAdminMiddle.js");
const {
  createPost,
  deletePost,
  like,
  disLikes,
  createComment,
  getPost,
  getAllPosts,
  cloudinaryUpload,
} = require("../controllers/postController.js");

const userRouter = express.Router();
const adminRouter = express.Router();
const postRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/getUser", getUser);
userRouter.get("/allfaq", allques);
userRouter.get("/allnotice", allnotice);
userRouter.post("/resetpassword", resetPassword);
userRouter.get("/forgotpassword/:id/:token", forgotPassword);
userRouter.post("/changepassword/:id/:token", changePassword);
userRouter.get("/userloggedin", authUser, userloggedin);
userRouter.get("/searchUser", authUser, searchUser);
userRouter.post("/faq", authUser, askQuestion);
userRouter.put("/:user_id/updateProfile", authUser, updateProfile);
userRouter.get("/:user_id", authUser, getUserData);
userRouter.post('/:user_id/uploadProfileImage', cloudinaryUploadpro.single('file'), uploadProfileImage);
userRouter.get("/userprofile/:user_id", authUser, userProfile);
userRouter.post("/userpassword/:user_id", authUser, userPassword);

// admin
adminRouter.post("/adminSignup", adminSignup);
adminRouter.get("/verifyEmail/:mobileNo/:verificationToken", verifyEmail);
adminRouter.post("/adminLogin", adminLogin);
adminRouter.post("/resetadminpass", resetAdminPass);
adminRouter.post("/verifyotp", verifyOtp);
adminRouter.post("/changeadminpass", changeAdminPass);
adminRouter.get("/Adminlogout", Adminlogout);
adminRouter.get("/adminLoggedIn", authAdmin, adminLoggedIn);
adminRouter.get("/searchadmin", authAdmin, searchAdmin);
adminRouter.post("/sendemail", authAdmin, sendMail);
adminRouter.post("/uploadnotice",authAdmin,upload.single("pdf"),uploadNotice);
adminRouter.delete("/deleteuser/:user_id", authAdmin, deleteUser);
adminRouter.get("/faq/notanswer", authAdmin, unanswered);
adminRouter.post("/faq/answer/:q_id", authAdmin, answer);
adminRouter.delete("/faq/delete/:q_id", authAdmin, deleteQuestion);

// Post routes
postRouter.post( "/createpost", cloudinaryUpload.single("file"), authUser, createPost);
postRouter.get("/getallpost", getAllPosts);
postRouter.delete("/deletepost/:post_id", authUser, deletePost);
postRouter.get("/like/:post_id", authUser, like);
postRouter.get("/dislike/:post_id", authUser, disLikes);
postRouter.post("/comment/:post_id", authUser, createComment);
postRouter.get("/getpost/:post_id", authUser,getPost );

module.exports = { userRouter, adminRouter, postRouter };
