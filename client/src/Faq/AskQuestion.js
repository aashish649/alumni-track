import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { BASE_URL } from '../utils/constants';

const AskQuestion = () => {
  const [question, setQuestion] = useState("");
  const { loggedInUserDetails } = useContext(AuthContext);

  const handleques = async () => {
    try {
      const userId = "userId";
      const userToken = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/users/faq`,
        { userId, question },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.success(
        "Question Asked! 📩 Your query is in our queue. Expect a response from the admin soon. Thanks for your patience!"
      );
      setTimeout(function() {
        window.location.reload(false);
    }, 2000);

    } catch (error) {
      console.error("Error asking question:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-gradient-to-r from-orange-100 to-amber-100 shadow-md rounded-md">
      <div className="text-center mb-4 flex justify-center">
        <span className="font-bold text-lg text-orange-600">
          Welcome {loggedInUserDetails.user.name}
        </span>
      </div>
      <h2 className="text-2xl font-bold mb-4">Ask Any Question to Admin</h2>
      <div className="mb-4">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Your Question
        </label>
        <textarea
          id="question"
          name="question"
          rows="2"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none  transition duration-150"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
      </div>
      <button
        type="button"
        onClick={handleques}
        className="inline-block bg-gradient-to-r font-semibold from-red-400 to-amber-300 text-black  px-4 py-2 rounded-md  focus:outline-none focus:shadow-outline-blue "
      >
        Submit
      </button>
      <ToastContainer />
    </div>
  );
};

export default AskQuestion;
