import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { BASE_URL } from "../utils/constants";

const HomeSection = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);

 

  const fetchUser = async () => {
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
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user data: ", err);
    }
  };

  useEffect(() => {
    fetchUser();
  },[])

  return (
    <div className="mx-auto my-8 h-full bg-slate-100">
      {user === null && <h4 className="text-center"></h4>}
      {user !== null && (
        <div className="flex justify-center">
          <div className="w-full max-w-xl border-solid border-2 border-gray-500 rounded-md p-8 mt-8 bg-gradient-to-r from-orange-100 to-amber-100 ">
            <ProfileImage user={user} setUser={setUser} />
            <hr className="my-4" />
            <div className="text-left">
              <table className="mx-auto border border-collapse border-gray-600 p-2 sm:p-4 text-sm sm:text-lg ">
                <tbody>
                  <tr className="border-b border-gray-600 p-3">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-500 w-52">
                      Name:
                    </td>
                    <td className="pb-3 pl-4 pr-5 ">{user.name}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3 ">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52 ">
                      Roll:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.rollNo}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-1">
                    <td className="pr-2 pb-2 pl-2 font-bold border-r border-gray-600 w-52 ">
                      Graduation Year:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.graduationYear}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52">
                      Branch:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.branch}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52">
                      Mobile No:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.mobileNo}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3 m-5">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52">
                      Email:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.email}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3 m-5">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52">
                      Organization:
                    </td>
                    <td className="pb-3 pl-4 pr-5 inline-block">{user.organization}</td>
                  </tr>
                  <tr className="border-b border-gray-600 p-3 m-5">
                    <td className="pr-4 pb-2 pl-2 font-bold border-r border-gray-600 w-52">
                      Designation:
                    </td>
                    <td className="pb-3 pl-4 pr-5">{user.designation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-ivory my-4 p-2 sm:p-4 mb-2">
              <b>BIO</b>
              <hr />
              {user.bio}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSection;
