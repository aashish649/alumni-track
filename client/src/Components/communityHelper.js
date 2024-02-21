import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BASE_URL } from "../utils/constants";

const CommunityHelper = ({ post }) => {
  const { loggedInUserDetails } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const { user_id } = useParams;
  const [more, setMore] = useState(false);

  const handleMore = () => {
    setMore(!more);
  };

  const renderContent = () => {
    const truncatedContent = post.content.split(" ").slice(0, 20).join(" ");
    return more ? post.content : truncatedContent;
  };

  useEffect(() => {
    setLiked(post.likes.includes(loggedInUserDetails.user._id));
    setComments(post.comments);
  }, [post.likes, post.comments, loggedInUserDetails.user._id, post.user]);

  const handleLike = async () => {
    try {
      const userToken = localStorage.getItem("token");
      await axios.get(`${BASE_URL}/post/like/${post._id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const userToken = localStorage.getItem("token");
      await axios.get(`${BASE_URL}/post/dislike/${post._id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setLiked(false);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleCreateComment = async () => {
    try {
      const userToken = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/post/comment/${post._id}`,
        { content: commentInput },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const newComment = response.data;
      setComments([...comments, newComment]);
      setCommentInput("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const userToken = localStorage.getItem("token");
      await axios.delete(
        `${BASE_URL}/post/deletepost/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-100 to-amber-100 overflow-hidden p-4 rounded-md shadow-md relative max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={post.user.photo.url}
            alt="User Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <p className="font-bold text-lg">
              <Link to={`/userprofile/${post.user._id}`}>{post.user.name}</Link>
            </p>
            <div className="text-[0.6rem] text-blue-600">
              <p>{post.user.designation}</p>
              <p>{post.user.organization}</p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <p>
            {new Date(post.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-md whitespace-pre-line">
          {renderContent()}
          {post.content.split(/\s+/).length > 20 && (
            <button onClick={handleMore} className="text-orange-500 ml-2">
              {more ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
      </div>

      <div className="mb-4">
        {post.image && (
          <img
            src={post.image.url}
            alt={post.image.filename}
            className="w-full h-64 object-cover rounded-md"
          />
        )}
      </div>

      <div className="flex items-center mb-2">
        <button
          className={`p-2 rounded ${liked ? "text-red-500" : "text-gray-500"}`}
          onClick={liked ? handleUnlike : handleLike}
        >
          {liked ? <BiLike size={40} /> : <BiLike size={40} />}
        </button>

        <input
          type="text"
          placeholder="Add a comment..."
          className="border p-1 flex-grow ml-4"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleCreateComment()}
        />
        <button
          className="p-2 ml-2 text-blue-500"
          onClick={handleCreateComment}
        >
          <FaRegComment size={20} />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          {post.user._id === loggedInUserDetails.user._id && (
            <a
              href="#"
              className="text-red-500 hover:underline text-sm"
              onClick={() => handleDeletePost()}
            >
              Delete Post
            </a>
          )}
        </div>

        <div>
          <button className="text-blue-500">
            <Link to={`/post/${post._id}`} className="text-blue">
              View Comments
            </Link>
          </button>
        </div>

        <div className="flex items-center">
          <p className="mr-2">{post.likes.length} Likes</p>
          <p>{post.comments.length} Comments</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityHelper;
