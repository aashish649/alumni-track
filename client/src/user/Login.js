import React, { useState, useContext,useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Authcontext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const [user, setuser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setuser({ ...user, [name]: value });
  };
  const [success, setSuccess] = useState(false);
  const { checkUserLoginStatus,loggedInUserDetails } = useContext(Authcontext);
  
  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();

    try {
  
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        user,
        { headers: { "Content-Type": "application/json" } }
      );

     
      if (response.data.success === true) {
        const token = response.data.token;
        console.log("User token ",token);

       
        localStorage.setItem("token", token);
        
        await checkUserLoginStatus();
        
        if (loggedInUserDetails && loggedInUserDetails.user) {
          navigate(`/dashboard/${loggedInUserDetails.user._id}`);
          toast.success("Login Successful!");
        } else {
          console.error("Invalid loggedInUserDetails:", loggedInUserDetails);
        }

      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.log("user-error", error.message);
      if (
        error.response &&
        error.response.status == 400 &&
        error.response.data.message
      ) {
        toast.error("Email or password is incorrect");
      } else if (
        error.response &&
        error.response.status == 403 &&
        error.response.data.message
      ) {
        toast.error("You are not registered! Please register yourself");
        setTimeout(() => {
          navigate("/signup");
        }, 2000);
      } else {
        toast.error("Error logging in! Please try again");
      }
    }
  };
  useEffect(() => {
    setuser({
      email: "",
      password: "",
    });
    
  }, []);
  return (
    <div className="flex justify-center items-center h-screen shadow-lg">
      <form
        onSubmit={handleLogin}
        className="shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 bg-amber-100"
      >
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
          required
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password:
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <span
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={handleTogglePassword}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 btn"
        >
          Login
        </button>
        <div className="mt-5">
          <Link
            to="/resetpassword"
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

export default LoginForm;
    

