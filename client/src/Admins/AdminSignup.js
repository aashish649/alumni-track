import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const AdminSignup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const validPassword = (password) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const password = user.password;

      if (!validPassword(password)) {
        toast.error(
          "Password must be at least 6 characters long with one uppercase letter, one lowercase letter, and one digit."
        );
        return;
      }

     
      const userToSend = {
        name: user.name,
        email: user.email,
        mobileNo: parseInt(user.mobileNo),
        password: user.password,
      };

     

      const response = await axios.post(
        `${BASE_URL}/admin/adminSignup`,
        userToSend,
        { headers: { "Content-Type": "application/json" } }
      );

      

      if (response.data.success) {
        toast.success(
          "Signed Up Successfully! Please wait for email Verification"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Error signing up. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error.message);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
        toast.error(
          "You are alredy registered! Redirecting to Admin-login page"
        );
        setTimeout(() => {
          navigate("/admin-login");
        }, 2000);
      } else {
        toast.error("Error signing up. Please try again.");
      }
    }
  };

  useEffect(() => {
    // Clear the form fields after successful signup
    setUser({
      name: "",
      email: "",
      mobileNo: "",
      password: "",
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen shadow-xl">
      <form
        onSubmit={handleSubmit}
        className="bg-amber-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="mobileNo"
        >
          Mobile No.:
        </label>
        <input
          type="text"
          id="mobileNo"
          name="mobileNo"
          value={user.mobileNo}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Sign Up
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminSignup;
