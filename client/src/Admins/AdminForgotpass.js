import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const AdminForgotPass = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
 

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/verifyotp`,
        {
          mobileNumber: mobileNo,
          otp: otp,
        }
      );
      if (response.data.success) {
        setMessage("Otp verified successfully");
        setOtpVerified(true);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error verifying OTP. Please try again.");
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/changeadminpass`,
        {
          mobileNumber: mobileNo,
          newPassword: newPassword,
        }
      );
      if (response.data.success) {
        setMessage("Password changed successfully");
        setTimeout(() => {
          navigate("/admin-login");
        }, 2000);
      } else {
        setMessage("Error changing password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error changing password. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-amber-100 rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        {" "}
        Forgot Password
      </h1>

      {message && <p className="text-green-700 font-bold mb-6">{message}</p>}

      <form>
        {!otpVerified && (
          <div className="mb-4">
            <label
              htmlFor="mobileNo"
              className="block text-sm font-medium text-gray-600"
            >
              Enter Mobile Number:
            </label>
            <input
              type="text"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              id="mobileNo"
              placeholder="Enter Mobile Number"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {!otpVerified && (
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-600"
            >
              Enter OTP:
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              id="otp"
              placeholder="Enter OTP"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {!otpVerified && (
          <button
            type="button"
            onClick={verifyOtp}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Verify OTP
          </button>
        )}

        {otpVerified && (
          <div className="mb-4 mt-6">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Enter New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="newPassword"
              placeholder="Enter New Password"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {otpVerified && (
          <button
            type="button"
            onClick={changePassword}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Change Password
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminForgotPass;
