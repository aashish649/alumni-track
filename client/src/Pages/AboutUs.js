import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto p-8 ">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to the Alumni Tracker Website
        </h1>

        <p className="mb-4">
          Whether you're a proud alum or an administrator, our platform is
          designed to enhance your experience.
        </p>

        <h2 className="text-2xl font-bold mb-4">For Users:</h2>
        <ul className="list-disc ml-8">
          <li>
            Create Posts: Share your updates by creating posts with text and
            images.
          </li>
          <li>
            Stay Connected: Like, comment, and engage with posts to stay
            connected with the community.
          </li>
          <li>
            Profile Exploration: Discover and explore the profiles of fellow
            alumni.
          </li>
          <li>
            Interactive FAQ: Ask questions and interact with the admin in the
            dedicated FAQ section.
          </li>
          <li>
            Password Management: Easily reset your password via email
            verification.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">For Admins:</h2>
        <ul className="list-disc ml-8">
          <li>
            Email Verification: Admin accounts undergo secure email
            verification.
          </li>
          <li>
            Password Reset: Admins can securely reset passwords using mobile
            OTPs.
          </li>
          <li>
            User Management: Search, view, and manage user profiles as needed.
          </li>
          <li>
            Communication Hub: Send mass emails and notices to users for updates
            and announcements.
          </li>
          <li>
            FAQ Administration: Manage and respond to user queries in the FAQ
            section.
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold my-8 text-center">Contributors</h2>
      <div className="flex justify-around p-2">
        <div className="text-center">
          <img
            src="/img1.jpg"
            alt=" 1"
            className="w-28 h-28 object-cover object-top rounded-full mb-3 m-3"
          />
          <p>Aashish Anand</p>
          <a
            href="https://www.linkedin.com/in/aashish-anand-07934822a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-red-500">LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>

        <div className="text-center">
          <img
            src="/img2.jpg"
            alt="Contributor 2"
            className="w-28 h-28 object-cover  object-top rounded-full mb-3 m-3"
          />
          <p>Chandra Kishor Yadav</p>
          <a href="linkedin_url_2" target="_blank" rel="noopener noreferrer">
            <span className="text-red-500">LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>

        <div className="text-center">
          <img
            src="/img3.jpg"
            alt="Contributor"
            className="w-28 h-28 object-cover rounded-full mb-2 m-3"
          />
          <p>Neha kumari</p>
          <a
            href="https://www.linkedin.com/in/neha-kumari-7288a7187/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-red-500">LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
