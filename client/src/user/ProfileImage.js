import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from "../utils/constants";
const ProfileImage = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user_id } = useParams();
 
  const handleImageUpload = async () => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const userToken = localStorage.getItem("token");
      
        const response = await axios.post(
          `${BASE_URL}/users/${user_id}/uploadProfileImage`, 
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const photoUrl = response.data.user.photo.url;
        setUser((prevUser) => ({
          ...prevUser,
          photo: {
            url: photoUrl,
          },
        }));

        setFile(null);

        console.log("Profile photo updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile photo: ", error);
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="text-center">
      <img
        src={
          user.photo.url ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        alt="Profile"
        className="h-40 w-40 object-cover rounded-full mx-auto mb-4"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        ref={fileInputRef}
        className="hidden"
      />
      <div>
        <button
          className="bg-gradient-to-r from-red-400 to-amber-200 text-black font-semibold px-4 py-2 rounded"
          onClick={openFileInput}
        >
          Choose New File
        </button>
        {file && (
          <button
            className="bg-gradient-to-r from-red-400 to-amber-200 text-black px-4 py-2 rounded ml-2"
            onClick={handleImageUpload}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
