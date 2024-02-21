// ViewAnswer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react';
import { BASE_URL } from '../utils/constants';

const ViewAnswer = () => {
  const [allFaqs, setallFaqs] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchallFaqs();
  }, []);

  const fetchallFaqs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/allfaq`);
      setallFaqs(response.data);
    } catch (error) {
      console.error('Error fetching all FAQs:', error.message);
    }
  };

  const toggle = (questionId) => {
    setSelectedQuestion((prevSelectedQuestion) =>
      prevSelectedQuestion === questionId ? null : questionId
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">All FAQs</h2>
      {allFaqs.map((faq) => (
        <div key={faq._id} className="mb-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggle(faq._id)}
          >
            <input
              type="text"
              className="flex-grow p-2 border rounded-l-md focus:outline-none"
              readOnly
              value={faq.question}
            />
            <button className="p-2 border rounded-r-md bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`h-6 w-6 ${
                  selectedQuestion === faq._id ? 'transform rotate-180' : ''
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          {selectedQuestion === faq._id && (
            <div className="mt-2">
              <p className="font-bold text-gray-700 mb-2">Answer:</p>
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewAnswer;
