import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const VerifyOtp = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/verifyotp`, {
        mobileNumber: mobileNo,
        otp: otp,
      });

      if (response.data.success) {
       setMessage("Otp verified");
       setTimeout(() => {
        navigate("/changepassword");
      }, 2000);
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>

      {message && <p className="text-red-600 font-bold mb-6">{message}</p>}

      <form>
        <div className="mb-4">
          <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-600">
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

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-600">
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

        <button
          type="button"
          onClick={verifyOtp}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
