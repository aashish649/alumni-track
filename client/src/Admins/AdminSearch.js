import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProfile from "./AdminProfile";
import { BASE_URL } from "../utils/constants";

const AdminSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [branch, setBranch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectUserId, setSelectUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchValue(value);
    } else if (name === "branch") {
      setBranch(value);
    }

    if (name === "search" && value === "") {
      setSearchResult([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${BASE_URL}/admin/searchadmin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchValue,
            branch: branch,
          },
        }
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Error searching user. Please try again.");
    }
  };

  const seeFullProfile = (user_Id) => {
    setSelectUserId(user_Id);
  };

  const closeProfile = () => {
    setSelectUserId(null);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Search Alumni</h2>
        <form
          onSubmit={handleSearch}
          className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-bold mb-2">
              Search by Name, Roll No, or Year
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
            <label htmlFor="branch" className="block text-sm font-bold mb-2">
              Select Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={branch}
              onChange={handleChange}
              className="w-full p-2 border"
            >
              <option value="">All Branches</option>
              <option value="Computer Science Engineering">
                Computer Science Engineering
              </option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electronics & Communication">
                Electronics & Communication
              </option>
              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
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
            {searchResult.users.map((user) => (
              <div
                key={user._id}
                className="border p-3 mb-4 bg-white rounded-md shadow-md max-w-md mx-auto mt-5"
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
                  <p className=" font-bold inline-block pr-2">
                    Graduation Year:
                  </p>
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
                  onClick={() => seeFullProfile(user._id)}
                >
                  See Full Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {selectUserId && <AdminProfile user_Id={selectUserId} onClose={closeProfile} />}
      </div>
    </div>
  );
};

export default AdminSearch;
