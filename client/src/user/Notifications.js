import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Notifications = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchAllNotices = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/allnotice`
        );
        setNotices(response.data.notices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchAllNotices();
  }, []);

  return (
    <div className="mx-auto my-8 p-4 bg-amber-100 rounded-md shadow-md max-w-md">
    <h2 className="text-2xl font-semibold mb-4">All Notices</h2>
    {notices.length > 0 ? (
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li key={notice._id} className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">{notice.title}</h3>
            <p className="text-gray-600">{notice.content}</p>
            <div className="mt-2">
              <a
                href={`${BASE_URL}/users/controllers/pdfuploads/${notice.pdf.filename}`}
                download
                className="bg-gradient-to-r font-semibold from-red-400 to-amber-300 text-black p-2 rounded inline-flex items-center"
              >
                Download Notice
                <svg
                  className="w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3a1 1 0 011-1h8a1 1 0 011 1v9.586l-1.293-1.293a1 1 0 00-1.414 0L10 14.586l-3.293-3.293a1 1 0 00-1.414 0L5 12.586V3zm-2 1a3 3 0 013-3h8a3 3 0 013 3v13a3 3 0 01-3 3H6a3 3 0 01-3-3V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No notices found</p>
    )}
  </div>
  );
};

export default Notifications;
