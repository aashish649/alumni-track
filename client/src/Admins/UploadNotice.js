import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../utils/constants";
const UploadNotice = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    pdf: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "pdf" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("pdf", formData.pdf);

      const response = await axios.post(
        `${BASE_URL}/admin/uploadnotice`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.success) {
        toast.success("Notice uploaded successfully");
        setTimeout(function() {
          window.location.reload(false);
      }, 2000);

      } else {
        console.error("Upload failed:", response.data.error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Upload Notice</h2>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-600"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* PDF File Input */}
        <div className="mb-4">
          <label
            htmlFor="pdf"
            className="block text-sm font-medium text-gray-600"
          >
            PDF File
          </label>
          <input
            type="file"
            id="pdf"
            name="pdf"  // Make sure the name attribute is "pdf"
            accept=".pdf"
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Upload Notice
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNotice;
