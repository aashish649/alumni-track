import React, { useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

const UserPassword = () => {
  const { user_id } = useParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      const userToken = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/users/userpassword/${user_id}`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(
            "Password changed successfully"
          );
          setTimeout(function() {
            window.location.reload(false);
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error changing password. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-amber-100 rounded shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
    {message && <p className="text-red-600 font-bold mb-6">{message}</p>}

    <div className="mb-4">
      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600">
        Current Password:
      </label>
      <input
        type="password"
        id="currentPassword"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
        New Password:
      </label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-600">
        Confirm New Password:
      </label>
      <input
        type="password"
        id="confirmNewPassword"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>

    <button
      onClick={handleChangePassword}
      className="w-full bg-gradient-to-r from-red-400 to-amber-200 text-black font-semibold p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
    >
      Change Password
    </button>
    <ToastContainer/>
  </div>
  );
};

export default UserPassword;
