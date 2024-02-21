import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import CreatePost from "./CreatePost";
import CommunityHelper from "./communityHelper";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const { loggedInUserDetails } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/post/getallpost`
      );

      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const sortpost = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <div className="container mx-auto max-w-md">
      <div className="mt-2 flex justify-center">
        <Link to="/createpost" className="bg-amber-100 text-black p-4 rounded shadow-md mb-8 block w-full text-center">
          Create Post
        </Link>
      </div>
      <div>
        {sortpost.map((post) => (
          <div key={post._id} className="mb-6">
            <CommunityHelper post={post} loggedInUserDetails={loggedInUserDetails} />
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Community;
