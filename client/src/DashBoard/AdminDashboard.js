import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_URL } from "../utils/constants";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from '../utils/constants';
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      localStorage.removeItem("adminToken");
      await axios.get(`${BASE_URL}/admin/Adminlogout`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Link to="/admin-dashboard">
        <div className="p-8 box-border sticky top-2 z-50 mt-5 mx-auto border-red-400 shadow-lg">
          <div className="container mx-auto flex items-center justify-center max-w-screen-xl">
            <img className="h-24" src={LOGO_URL} alt="Logo" />
            <Link to="" className="text-black text-3xl font-bold ml-4">
              Alumni Tracker
            </Link>
          </div>
        </div>
      </Link>

      <nav className="bg-white p-4 box-border sticky top-2 z-50 mt-14 mx-auto rounded-lg border-red-400 shadow-lg ">
        <div className="container mx-auto flex flex-wrap justify-center space-x-4 items-center box-border">
          <Link
            to="/sendemail"
            className="box-link bg-blue-500 text-white text-lg px-6 py-6"
          >
            Send Message
          </Link>

          <Link
            to="/adminsearch"
            className="box-link bg-yellow-500 text-white text-lg focus:outline-none px-6 py-6"
          >
            Search An Alumni
          </Link>

          <Link
            to="/uploadnotice"
            className="box-link bg-purple-500 text-white text-lg focus:outline-none px-6 py-6"
          >
            Upload Notice
          </Link>

          {/* Dropdown And Admin option */}
          <div className="relative group">
            <button className="box-link bg-red-500 text-white focus:outline-none px-6 py-6">
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
            <div className="absolute hidden group-hover:block bg-white text-black space-y-2 py-2">
              <Link
                to="/answerfaq"
                className="box-link bg-gray-500 text-white block px-6 py-6"
              >
                Faq's
              </Link>
              <button
                onClick={handleLogout}
                className="box-link bg-orange-500 text-white block px-6 py-6"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
