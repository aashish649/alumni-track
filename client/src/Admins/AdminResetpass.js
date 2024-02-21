import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const AdminResetpass = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleMobile = (e) => {
    setMobileNo(e.target.value);
  };

  const resetPass = async (e) => {
    e.preventDefault();

    try {
      if (!mobileNo) {
        toast.error("Mobile nummber is required!", {
          position: "top-center",
        });
        return;
      }

      const response = await axios.post(`${BASE_URL}/admin/resetadminpass`,
      {mobileNumber:mobileNo}
      );
      if (response.data.success) {
        setMobileNo('');
        setMessage('OTP sent successfully to your mobile number');
        setTimeout(() => {
          navigate("/adminforgotpass");
        }, 2000);
        console.log("OTP sent",mobileNo);
      } else {
        toast.error(response.data.message, {
          position: 'top-center',
        });
      }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error sending OTP', {
          position: 'top-center',
        });
    }
  };

  return(
    <section className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-amber-100 p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Enter Your Mobile Number
        </h1>

        {message && (
          <p className="text-green-600 font-bold mb-6">{message}</p>
        )}

        <form>
          <div className="mb-6">
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNo}
              onChange={handleMobile}
              name="mobileNumber"
              id="mobileNumber"
              placeholder="Enter Your Mobile Number"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={resetPass}
          >
            Send OTP
          </button>
        </form>

        <ToastContainer />
      </div>
    </section>

  );

};

export default AdminResetpass;
