
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Profile";
import { BASE_URL } from "../utils/constants";
const SearchUser = () => {
  const [searchValue, setSearchValue] = useState("");
  const [branch, setBranch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchValue(value);
    } else if (name === "branch") {
      setBranch(value);
    }


    if (name === "search"  && value === "") {
      setSearchResult([]);
      setSelectedUserId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (!searchValue && !branch) {
        toast.error("Provide details to search");
        return;
      }

      const userToken = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/users/searchUser`,
        {
          params: { search: searchValue, branch },
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      setSearchResult(response.data.user);
    } catch (error) {
      console.error("Error searching alumni:", error);
      toast.error("Alumni is not available");
      setSearchResult([]);
    }
  };

  const handleSeeFullProfile = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseFullProfile = () => {
    setSelectedUserId(null);
  };

  return (
    <body className="flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Search Alumni</h2>
        <form
          onSubmit={handleSubmit}
          className={`max-w-md mx-auto ${
            searchResult.length > 0 ? "mt-8" : ""
          }`}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="search">
              Search by Name,Roll No,or Year
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchValue}
              onChange={handleChange}
              className="w-full p-2 border"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="branch">
              Select Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={branch}
              onChange={handleChange}
              className={`w-full p-2 border ${
                window.innerWidth < 500 ? 'text-sm' : ''
              }`}
            >
              <option value="">Select</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Msc Mathematics">Msc Mathematics</option>
              
              
            
            </select>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-red-400 to-amber-200 text-black font-semibold p-3 rounded mb-5"
          >
            Search Alumni
          </button>
        </form>

        {searchResult !== null && (
          <div>
            {searchResult.map((user) => (
              <div
                key={user._id}
                className="border p-3 mb-4 bg-white rounded-md shadow-md max-w-md mx-auto bg-gradient-to-r from-orange-100 to-amber-100"
              >
              <h4 className="text-lg font-bold mb-2">{user.name}</h4>
           <div className="text-left mb-2">
              <p className="font-bold inline-block pr-2">Email:</p>
               <p className="text-lg inline-block">{user.email}</p>
             </div>
            <div className="text-left mb-2">
               <p className=" font-bold inline-block pr-2">Roll No:</p>
               <p className="text-lg inline-block">{user.rollNo}</p>
             </div>
             <div className="text-left mb-2">
               <p className=" font-bold inline-block pr-2">Graduation Year:</p>
               <p className="text-lg inline-block">{user.graduationYear}</p>
             </div>
             <div className="text-left mb-2">
               <p className=" font-bold inline-block pr-2">Branch:</p>
               <p className="text-lg inline-block">{user.branch}</p>
             </div>
             <div className="text-left mb-2">
               <p className=" font-bold inline-block pr-2">Designation:</p>
               <p className="text-lg inline-block">{user.designation}</p>
             </div>
             <div className="text-left mb-2">
               <p className="font-bold inline-block pr-2">Organization:</p>
               <p className="text-lg inline-block">{user.organization}</p>
             </div>
                <button
                  className="bg-gradient-to-r from-red-400 to-amber-200 text-black font-semibold p-2 rounded mt-2"
                  onClick={() => handleSeeFullProfile(user._id)}
                >
                  See Full Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedUserId && (
          <Profile userId={selectedUserId} onClose={handleCloseFullProfile} />
        )}
      </div>
    </body>
  );
};

export default SearchUser;
