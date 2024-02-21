import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const AdminLogin = () => {
  const [user, setUser] = useState({
    mobileNo: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const { checkAdminLogin } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
    

      const response = await axios.post(
        `${BASE_URL}/admin/adminLogin`,
        user,
        { headers: { "Content-Type": "application/json" } }
      );

    
      if (response.data.success === true) {
        const token = response.data.token;

        localStorage.setItem("adminToken", token);
        console.log(
          "Token saved to localStorage:",
          localStorage.getItem("adminToken")
        );

        await checkAdminLogin();

        navigate("/admin-dashboard");
        toast.success("Login Successful!");
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);

      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message
      ) {
        toast.error("Invalid mobile number or password");
      } else if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.message ===
          "Email not verified.Please verify your email first to login as an admin"
      ) {
        toast.error(
          "Email not verified. Please verify your email first to login as an admin"
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.message ===
          "You are not registered! Please register yourself"
      ) {
        toast.error("You are not registered! Please register yourself");
        setTimeout(() => {
          navigate("/admin-signup");
        }, 2000);
      } else {
        toast.error("Error logging in! Please try again");
      }
    }
  };
  useEffect(() => {
  }, []);

  return (
    <div className="flex justify-center items-center h-screen shadow-lg">
      <form
        onSubmit={handleLogin}
        className="bg-amber-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="mobileNo"
        >
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobileNo"
          name="mobileNo"
          value={user.mobileNo}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
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
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Login
        </button>
        <div className="mt-5">
          <Link
            to="/adminresetpass"
            className="text-sm text-blue-700 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
