import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from '../utils/constants';
const FaqHelper = ({ question_id }) => {
  console.log("question_id:", question_id);
  const [answer, setAnswer] = useState("");

  const submitHandler = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${BASE_URL}/admin/faq/answer/${question_id._id}`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `${BASE_URL}/admin/faq/delete/${question_id._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-6 mb-5">
      <label className="font-bold text-lg mr-2">Question:</label>

      <div className="border p-4 flex flex-col items-start mt-2">
        <div className="flex mb-2">
          <span className="font-bold text-lg text-blue-500">
            {question_id.user.rollNo}
          </span>
          <span className="text-gray-700 text-lg font-semibold ml-2">
            {question_id.user.name}
          </span>
        </div>
        <p className="text-gray-700 text-lg font-semibold">
          {question_id.question}
        </p>
      </div>

      <div className="mt-4">
        <label className="font-bold text-lg ">Answer:</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter Your Answer"
          className="border p-4 mt-2 w-full resize-y" 
          rows={1} 
        ></textarea>
      </div>

      <div className="flex mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={submitHandler}
        >
          Submit Answer
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline-red active:bg-red-800"
          onClick={deleteHandler}
        >
          Delete Question
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FaqHelper;
