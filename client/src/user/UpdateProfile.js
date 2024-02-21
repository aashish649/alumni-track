import React, { useState,useEffect,useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams,useNavigate } from "react-router-dom";
import Authcontext from "../context/AuthContext";
import { BASE_URL } from "../utils/constants";
const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    graduationYear: "",
    mobileNo: "",
    branch: "",
    designation: "",
    organization: "",
    bio: "",
  });

  const { user_id } = useParams();
  const navigate = useNavigate();
  const { loggedInUserDetails } = useContext(Authcontext);

  useEffect(() => {
    const currentUser = async () => {
      try {
        const userToken = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/users/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const userData = response.data.user;
        setFormData({
          name: userData.name,
          email: userData.email,
          rollNo: userData.rollNo,
          graduationYear: userData.graduationYear,
          mobileNo: userData.mobileNo,
          branch: userData.branch,
          designation: userData.designation,
          organization: userData.organization,
          bio: userData.bio,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    currentUser();
  }, [user_id]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userToken = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/users/${user_id}/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile updated successfully");

      const updatedResponse = await axios.get(
        `${BASE_URL}/users/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const updatedUserData = updatedResponse.data.user;

      setFormData({
        name: updatedUserData.name,
        email: updatedUserData.email,
        rollNo: updatedUserData.rollNo,
        graduationYear: updatedUserData.graduationYear,
        mobileNo: updatedUserData.mobileNo,
        branch: updatedUserData.branch,
        designation: updatedUserData.designation,
        organization: updatedUserData.organization,
        bio: updatedUserData.bio,
      });

      setTimeout(() => {
        navigate(`/dashboard/${loggedInUserDetails.user._id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error.response.data);
    }
  };
  return (
    <div className=" mx-auto  flex justify-center items-center h-full bg-slate-200 overflow-hidden ">
      <div className="w-full max-w-lg border-solid border-2 border-gray-500 rounded-md p-8 mt-8  bg-gradient-to-r from-orange-100 to-amber-100  ">
        <h2 className="text-2xl font-bold mb-4 flex justify-center text-center font-serif ">Update Your Profile</h2>
        <form onSubmit={handleSubmit} className=" mx-auto max-w-xl">
          <label className="block mb-2 text-dark font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-solid border-2 border-gray-300 rounded-md   "
          />
          <label className="block mb-2 font-medium">Email:</label>
          <input
            type="text"
            name=""
            value={formData.email}
            disabled
            // onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />
          <label className="block mb-2 font-medium">Roll number:</label>
          <input
          
            name=""
            value={formData.rollNo}
            // onChange={handleChange}
            disabled
            className="w-full p-2 mb-6  border-2 border-gray-300 rounded-md"
          />

          <label className="block mb-2 font-medium">Graduation year:</label>
          <input
            type="text"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />
          <label className="block mb-2 font-medium">Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select Branch
            </option>
            <option value="Computer Science Engineering">
              Computer Science Engineering
            </option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Mechanical Engineering">
              Mechanical Engineering
            </option>
            <option value="Electronics & Communication">
              Electronics & Communication
            </option>
            <option value="Electrical Engineering">
              Electrical Engineering
            </option>
            <option value="Msc Mathematics">Msc Mathematics</option>
          </select>

          <label className="block mb-2 font-medium">Mobile number:</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />

          <label className="block mb-2 font-medium">Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />
          <label className="block mb-2 font-medium">Organization:</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />
          <label className="block mb-2 font-medium">Bio:</label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 mb-6 border-2 border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-gradient-to-r font-semibold from-red-400 to-amber-300 text-black p-2 rounded">
            Update Profile
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;
