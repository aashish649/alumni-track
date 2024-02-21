import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

const AdminProfile = ({ user_Id, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/getUser`
        );
        const users = response.data;

        const selectedUser = users.find((user) => user._id === user_Id);

        setUser(selectedUser);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserDetails();
  }, [user_Id]);

  const deleteProfile = async () => {
    const deleteconfirme = window.confirm(
      `Are you sure you want to remove the user ${user.name} (Roll No: ${user.rollNo})? This action cannot be undone.`
    );

    if (deleteconfirme) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(
          `${BASE_URL}/admin/deleteuser/${user_Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("User profile deleted successfully");
        
        setTimeout(function() {
          window.location.reload(false);
      }, 2000);
  


      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
      {user && (
        <div className="mx-auto my-8 h-full">
          <div className="flex justify-center">
            <div className="w-full max-w-md border-solid border-2 border-gray-500 rounded-lg p-2 mt-8 bg-gradient-to-r from-orange-200 to-amber-100 overflow-hidden">
              <img
                src={user.photo.url}
                className="rounded-full w-20 h-20 mx-auto mb-4"
              />
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
              <div className="bg-ivory p-4 overflow-y-auto max-h-[400px]">
                <b>BIO</b>
                <hr />
                {user.bio}
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gradient-to-r from-red-400 to-amber-200 text-black p-2 rounded mt-2"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="bg-gradient-to-r from-red-400 to-amber-200 text-black p-2 rounded mt-2"
                  onClick={deleteProfile}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
