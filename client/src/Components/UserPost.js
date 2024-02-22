import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunityHelper from "./communityHelper";
import { useParams,Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BASE_URL } from "../utils/constants";

const UserPost = ({}) => {
  const { loggedInUserDetails } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [post, setPost] = useState(null);
  const { post_id } = useParams();
  const [more,setMore] = useState(false);

  const handleMore = () =>  {
    setMore(!more);
  }

  const renderContent = () => {
    const truncatedContent = post.content.split(" ").slice(0, 20).join(" ");
    return more ? post.content : truncatedContent;
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userToken = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/post/getpost/${post_id}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (response.data.success) {
          setPost(response.data.post);
          setLiked(
            response.data.post.likes.includes(loggedInUserDetails.user._id)
          );
          setComments(response.data.post.comments);
        } else {
          console.error("Error fetching post:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [post_id, loggedInUserDetails.user._id]);

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

  return (
    <div className="bg-gradient-to-r from-orange-100 to-amber-100 overflow-hidden p-4 rounded-md shadow-md max-w-md mx-auto mt-8">
      {post !== null && (
        <>
          <div className={`flex flex-col mb-4 ${window.innerWidth < 700 ? 'max-w-sm' : 'max-w-md'}`}>
        <div className="flex items-center mb-2">
          <img
            src={post.user.photo.url}
            alt="User Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <p className="font-bold text-lg">
              <Link to={`/userprofile/${post.user._id}`}>
                {post.user.name}
              </Link>
            </p>
            <div className="text-xs">
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
              <div className="w-full h-64 overflow-hidden rounded-md">
                <img
                  src={post.image.url}
                  alt={post.image.filename}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex items-center mb-2">
            <button
              className={`p-2 rounded ${
                liked ? "text-red-500" : "text-gray-500"
              }`}
              onClick={liked ? handleUnlike : handleLike}
            >
              {liked ? <BiLike size={30} /> : <BiLike size={30} />}
            </button>

            <input
              type="text"
              placeholder="Add a comment..."
              className="border p-1 flex-grow ml-4"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              className="p-2 ml-2 text-blue-500"
              onClick={handleCreateComment}
            >
              <FaRegComment size={20} />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">All Comments</h3>
            {comments && comments.length > 0 ? (
              <div>
                {comments.map((comment) => (
                  <div key={comment._id} className="mb-1">
                    <p
                      className="font-semibold inline"
                      style={{ color: "#4169E1" }}
                    >
                      {comment.user.name}:
                    </p>
                    <p className="mb-1 ml-2 inline">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          <div className="flex items-center mt-4">
            <p className="mr-2">{post.likes.length} Likes</p>
            <p>{comments.length} Comments</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPost;
