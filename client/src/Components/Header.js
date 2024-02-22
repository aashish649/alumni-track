import { LOGO_URL } from "../utils/constants";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <nav
        className={`bg-gray-800 p-5 box-border sticky top-0 z-50 mt-1 ml-1 mr-1 rounded-lg border-blue-400 ${
          isDarkMode
            ? "dark:bg-gray-900 dark:text-white !important"
            : "text-white !important"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
          <div className="flex items-center">
            <img className="mr-2 rounded h-10" src={LOGO_URL} alt="Logo" />
            <Link to="" className="text-white text-2xl font-bold mr-4">
              Alumni Tracker
            </Link>

            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              size={30}
            />
          </div>

         
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                )}
              </svg>
            </button>
          </div>

          {/* Responsive navigation menu for small screens */}
          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } lg:hidden absolute top-16 right-0 bg-gray-800 text-white p-4 rounded w-48`}
          >
            <Link
              to="/notable-alumni"
              className="block px-4 py-2 hover:text-blue-500"
            >
              Notable Alumni
            </Link>
            <Link
              to="/about-us"
              className="block px-4 py-2 hover:text-blue-500"
            >
              About Us
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 hover:bg-blue-500 hover:text-white"
            >
              Signup
            </Link>
            <div className="relative group">
              <button className="text-white focus:outline-none">
                Admin
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
              <div className="absolute hidden group-hover:block bg-gray-800 text-white  space-y-2  py-2 rounded">
                <Link
                  to="/admin-login"
                  className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-sm"
                >
                  Admin Login
                </Link>
                <Link
                  to="/admin-signup"
                  className="block px-4 py-2 hover:bg-blue-500 hover:text-white"
                >
                  Admin Signup
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop navigation for larger screens */}
          <div className="hidden lg:flex lg:space-x-4 items-center box-border">
            <Link
              to="/notable-alumni"
              className="text-white text-md px-4 py-2 cursor-pointer hover:text-blue-500"
            >
              Notable Alumni
            </Link>
            <Link
              to="/about-us"
              className="text-white text-md cursor-pointer hover:text-blue-500"
            >
              About Us
            </Link>
            <Link
              to="/login"
              className="text-white text-md focus:outline-none hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white text-md focus:outline-none hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
            >
              Signup
            </Link>
            <div className="relative group">
              <button className="text-white focus:outline-none">
                Admin
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
              <div className="absolute hidden group-hover:block bg-gray-800 text-white  space-y-2  py-2 rounded">
                <Link
                  to="/admin-login"
                  className="block px-4 py-2 cursor-pointer  hover:bg-blue-500 hover:text-white rounded-sm"
                >
                  Admin Login
                </Link>
                <Link
                  to="/admin-signup"
                  className="block px-4 py-2 cursor-pointer  hover:bg-blue-500 hover:text-white "
                >
                  Admin Signup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
