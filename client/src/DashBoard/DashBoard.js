import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LOGO_URL } from "../utils/constants";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import HomeSection from "../user/HomeSection";
import AuthContext from "../context/AuthContext";
import { io } from "socket.io-client";


const Dashboard = () => {
  const [newNotices, setNewNotices] = useState([]);
  const navigate = useNavigate();
  const { loggedInUserDetails } = useContext(AuthContext);

  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
  
    socket.on('newnotice', (newNotice) => {
      console.log('New notice received:', newNotice);
  
     setNewNotices((prevNotices) => {
      const updatedNotices = [newNotice, ...prevNotices];
      console.log('Updated Notices:', updatedNotices);
      return updatedNotices;
    });
  });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      const userToken = localStorage.getItem("token");
      localStorage.removeItem("token");
      await axios.get("http://localhost:4000/api/v1/users/logout", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <div className="mx-auto h-full bg-slate-100">
      <Link to="/dashboard">
        <nav className="bg-amber-100 p-4 box-border top-0 sticky z-50 ml-1 mr-1 rounded-lg border-red-400 shadow-lg">
          <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
            <div className="flex items-center">
              <img className="mr-2 rounded h-10" src={LOGO_URL} alt="Logo" />
              <Link to="/alumni" className="text-black text-2xl font-bold">
                Alumni Tracker
              </Link>
            </div>

            <div className="flex space-x-4 items-center box-border">
              <Link
                to={`/home/${loggedInUserDetails.user._id}`}
                className="text-black text-md focus:outline-none px-4 py-2 rounded cursor-pointer hover:bg-gradient-to-r from-red-400 to-amber-200  hover:text-black"
              >
                Profile
              </Link>
              <Link
                to={`/${loggedInUserDetails.user._id}/update`}
                className="text-black text-md focus:outline-none px-4 py-2 rounded cursor-pointer hover:bg-gradient-to-r from-red-400 to-amber-200  hover:text-black"
              >
                Update Profile
              </Link>
              <Link
                to="/search"
                className="text-black text-md focus:outline-none hover:bg-gradient-to-r from-red-400 to-amber-200  hover:text-black px-4 py-2 rounded"
              >
                Search An Alumni
              </Link>
              <div>
                <Link
                  to="/community"
                  className="text-black text-md focus:outline-none hover:bg-gradient-to-r from-red-400 to-amber-200 hover:text-black px-4 py-2 rounded"
                >
                  Community
                </Link>
                <Link to="/notifications">
                <button className="text-black text-md focus:outline-none hover:bg-gradient-to-r from-red-400 to-amber-200 hover:text-black px-4 py-2 rounded">
                  Notices
                  {console.log(
                    "Notification Alert in UI:",
                    newNotices.length > 0
                  )}
                  {newNotices.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white px-2 py-1 rounded-full absolute -top-1 -right-1">
                      {newNotices.length}
                    </span>
                  )}
                </button>
              </Link>
              </div>
           
              

              {/* More dropdown */}
              <div className="relative group">
                <button className="text-black focus:outline-none">
                  More
                  <svg
                    className="h-5 w-5 inline-block ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block bg-amber-100 text-black space-y-2 py-2 rounded">
                  <Link
                    to="/faq"
                    className="block px-2 py-2 cursor-pointer hover:bg-gradient-to-r from-red-400 to-amber-200 hover:text-black rounded-sm"
                  >
                    Faq's
                  </Link>
                  <Link
                    to={`/userpassword/${loggedInUserDetails.user._id}`}
                    className="block px-2 py-2 cursor-pointer hover:bg-gradient-to-r from-red-400 to-amber-200 hover:text-black "
                  >
                    Change password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-2 py-2 cursor-pointer hover:bg-gradient-to-r from-red-400 to-amber-200 hover:text-black "
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </Link>
      <ToastContainer />
      <HomeSection />
    </div>
  );
};

export default Dashboard;
