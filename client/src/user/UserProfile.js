import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userToken = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/users/userprofile/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const userData = response.data.user;

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserDetails();
  }, [user_id]);

  const handleClose = () => {
    navigate("/community");
  };

  return (
    <>
      {user && (
        <div className="mx-auto my-8 h-full  flex justify-center items-center">
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

            <div className="flex justify-center mt-2">
              <button
                className="bg-gradient-to-r from-red-400 to-amber-200 text-black p-2 rounded"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
