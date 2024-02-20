import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FaqHelper from './FaqHelper';

const AnswerFaq = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(`http://localhost:4000/api/v1/admin/faq/notanswer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="mx-auto  my-16 max-w-lg">
      <h1 className="text-center text-3xl font-bold mb-8">Answer Frequently Asked Questions</h1>
      {posts.length > 0 &&
        posts.map((question_id) => <FaqHelper key={question_id._id} question_id={question_id} />)}
    </div>
  );
};

export default AnswerFaq;