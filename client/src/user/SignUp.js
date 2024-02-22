import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

const SignupForm = () => {
  const [user, setuser] = useState({
    name: "",
    rollNo: "",
    graduationYear: "",
    email: "",
    mobileNo: "",
    branch: "Msc Mathematics", // Default branch
    password: "",
  });

  const navigate = useNavigate();

  // State variable to handle Error Messages

  const [errorChecking, seterrorChecking] = useState(false);
  const [success, setSuccess] = useState(false);

  const engineeringBranches = [
    "Computer Science Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Msc Mathematics",
  ];

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setuser({ ...user, [name]: value });
  };

  // Password must be of 6 characters long having one Uppercase,LowerCase,one digit.
  const validPassword = (password) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const password = user.password;
      if (!validPassword(password)) {
        // Password doesn't meet the criteria
        seterrorChecking(true);
        toast.error(
          "Password must be at least 6 characters long with one uppercase letter, one lowercase letter, and one digit."
        );
        return;
      }
      
      const userToSend = {
        name: user.name,
        rollNo: parseInt(user.rollNo),
        graduationYear: parseInt(user.graduationYear),
        email: user.email,
        mobileNo: parseInt(user.mobileNo),
        branch: user.branch,
        password: user.password,
      };


      const response = await axios.post(
        `${BASE_URL}/users/signup`,
        userToSend,
        { headers: { "Content-Type": "application/json" } }
      );
   

      if (response.data.success) {
        setSuccess(true);
        toast.success("Signed Up Successfully! redirecting to login page");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        seterrorChecking(true);
        toast.error("Error signing up. Please try again.");
      }
    } catch (error) {
    
      console.error("Signup failed:", error.message);

      // Handle specific case when user is already registered
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
        seterrorChecking(true);
        toast.error("You are alredy registered! Redirecting to login page");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Error signing up. Please try again.");
      }
    }
  };

  useEffect(() => {
    // Clear the form fields after successful signup
    setuser({
      name: "",
      rollNo: "",
      graduationYear: "",
      email: "",
      mobileNo: "",
      branch: "Msc Mathematics", 
      password: "",
    });
  }, []);

  return (
    <div className="flex justify-center items-center  mt-5 border-none rounded ">
      <form
        onSubmit={handleSubmit}
        className= "shadow-md border-black rounded-lg mt-6 px-8 pt-6 pb-8 mb-4 w-96 bg-amber-100"
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
          className="shadow appearance-none border rounded w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="rollNo"
        >
          Roll No.:
        </label>
        <input
          type="text"
          id="rollNo"
          name="rollNo"
          value={user.rollNo}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="graduationYear"
        >
          Year of Graduation:
        </label>
        <input
          type="text"
          id="graduationYear"
          name="graduationYear"
          value={user.graduationYear}
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
          htmlFor="branch"
        >
          Branch:
        </label>
        <select
          id="branch"
          name="branch"
          value={user.branch}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         
        >
          {engineeringBranches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Sign Up
        </button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
        />
    </div>
  );
};

export default SignupForm;
