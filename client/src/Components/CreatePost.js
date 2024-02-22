import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const { loggedInUserDetails } = useContext(AuthContext);
  const { name } = loggedInUserDetails;
  const [image, setImage] = useState(null);

  const handleImage = (event) => {
    setImage(event.target.files[0]);
  };

  const navigate = useNavigate();

  const createPost = async () => {
    try {
      const userToken = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("name", name);
      if (image) {
        formData.append("file", image);
      }

      const response = await axios.post(
        `${BASE_URL}/post/createpost`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Post Created Successfully");
      setTimeout(() => {
        navigate("/community");
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-100 shadow-md rounded-md p-6 mt-20 container mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-4">What's on your mind</h1>
      <p className="text-lg font-semibold mb-2">
        {loggedInUserDetails.user.name}
      </p>
      <textarea
        rows="4"
        cols="50"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full resize-none"
      />

      <label htmlFor="image" className="mb-2 block">
        Choose an image
      </label>
      <input
        type="file"
        id="file"
        accept="image/*"
        onChange={handleImage}
        className="mb-4 w-full"
      />

      <button
        onClick={createPost}
        className="bg-gradient-to-r font-semibold from-red-400 to-amber-300 text-black p-2 rounded w-full"
      >
        Create Post
      </button>
      <ToastContainer />
    </div>
  );
};

export default CreatePost;
