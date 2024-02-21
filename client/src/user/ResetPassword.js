import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from "../utils/constants";
const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();

    try {
      if (!email) {
        toast.error('Email is required!', {
          position: 'top-center',
        });
        return;
      }
      const response = await axios.post(`${BASE_URL}/users/resetpassword`, { email });
      if (response.data.success) {
        setEmail('');
        setMessage('Password reset link sent successfully to your email');
      } else {
        toast.error(response.data.message, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending password reset link', {
        position: 'top-center',
      });
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-amber-100 p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Enter Your Email
        </h1>

        {message && (
          <p className="text-green-600 font-bold mb-6">{message}</p>
        )}

        <form>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={setVal}
              name="email"
              id="email"
              placeholder="Enter Your Email Address"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={sendLink}
          >
            Send
          </button>
        </form>

        <ToastContainer />
      </div>
    </section>
  );
};

export default ResetPassword;
