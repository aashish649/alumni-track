const Post = require("../models/post.js");
const User = require("../models/user.js");
const multer = require("multer");
const cloudinary = require("cloudinary");
const fs = require('fs');
const { uploadToCloudinary } = require("../utils/cloudinary.js");
const path = require('path');

// const imgconfig = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./uploads");
//   },
//   filename: (req, file, callback) => {
//     // Ensure a unique filename with timestamp for every file
//     const extname = path.extname(file.originalname).toLowerCase();
//     callback(null, file.fieldname + '-' + Date.now() + extname);
//   },
// });


const imgconfig = multer.memoryStorage();

const cloudinaryUpload = multer({
  storage: imgconfig,
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


const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { user_id } = req.user;

    const user = await User.findById(user_id);

    let imageUrl, imageFilename;

    if (req.file) {
      const folderName = 'alumni';
      let uploadAttempts = 3;

      while (uploadAttempts > 0) {
        try {
          const upload = await uploadToCloudinary(req.file.buffer, folderName);
          imageUrl = upload.secure_url;
          imageFilename = upload.public_id;
          break; // Break out of the loop if upload is successful
        } catch (uploadError) {
          console.error(`Error during Cloudinary upload. Retrying... Attempts left: ${uploadAttempts - 1}`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

        uploadAttempts--;
      }

      if (uploadAttempts === 0) {
        return res.status(500).json({ success: false, error: 'Error uploading file to Cloudinary' });
      }
    }

    const newPost = await Post.create({
      content: content,
      user: user_id,
      image: {
        url: imageUrl,
        filename: imageFilename,
      },
    });

    user.post.push(newPost);
    await user.save();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      user: user_id,
      post:newPost,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const {user_id} = req.user;

   
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(403).json({
        success: false,
        error: "Post Not Found",
      });
    }

    if (post.user.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized: You are not allowed to delete this post",
      });
    }

    await User.findByIdAndUpdate(user_id, {
      $pull: { post: postId },
    });

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



const like = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const { user_id } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post Not Found",
      });
    }

    post.likes.push(user_id);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post: post,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const disLikes = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const { user_id } = req.user;

    const post = await Post.findById(postId);

    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post Not Found",
      });
    }

    if (!post.likes.includes(user_id)) {
      return res.status(400).json({
        success: false,
        error: "You have not liked this post",
      });
    }
     await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user_id },
    }, { new: true });


    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post: post,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



const createComment = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const { content } = req.body;
    const { user_id, name, rollNo } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post Not Found",
      });
    }

    const newComment = {
      content: content,
      user: user_id,
      name: name,
      rollNo: rollNo,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: {
        content: newComment.content,  
        user: newComment.user,
        name: newComment.name,
      },
      user:user_id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};




const getPost = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const post = await Post.findById(postId).populate({
      path: 'user',
      select: 'name designation photo rollNo _id organization', 
    }).populate({
      path: 'comments.user',
      select: 'name designation photo rollNo _id organization',
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    post.comments.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: 'user',
      select: 'name designation photo rollNo _id organization', 
    }).populate({
      path: 'comments.user',
      select: 'name designation photo rollNo _id organization',
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports = { createPost, deletePost, like, disLikes, createComment,getPost,getAllPosts,cloudinaryUpload };
