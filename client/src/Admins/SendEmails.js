import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

const SendEmails = () => {
  const [to, setTo] = useState("all");
  const [from,setFrom] = useState('aashishanand973@gmail.com');
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/getUser`
        );
        setUsers(response.data);
        console.log("send email admin", response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEmail = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${BASE_URL}/admin/sendemail`,
        {
          to: to === "specific" ? selectedUser : to,
          from,
          subject,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Email Sent", response.data.success);
      console.log(response.data.message);
      toast.success(response.data.message);
      setTimeout(function() {
        window.location.reload(false);
    }, 2000);
    } catch (error) {
      console.error("error", error);
    }
  };
  return (
    <div className="flex flex-col mt-5 justify-center mx-auto  max-w-md h-full" >
    <div className="text-center  ">
      <h2 className="text-2xl font-bold mb-4">Send Email</h2>
      <form
        className="mx-auto bg-white p-6 rounded-md shadow-md"
        onSubmit={handleEmail}
      >
        <div className="mb-4">
          <label htmlFor="from" className="block text-sm font-bold mb-2">
            {" "}
            From
          </label>
          <input
            type="text"
            id="from"
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 border"
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-bold mb-2">
            {" "}
            Send to
          </label>
          <select
            name="to"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="all">Send email to all users</option>
            <option value="specific">Send email to specific users</option>
          </select>
        </div>
        {to === "specific" && (
          <div className="mb-4">
            <label
              htmlFor="selectedUser"
              className="block text-sm font-bold mb-2"
            >
              Enter User's Email
            </label>
            <input
              type="text"
              id="selectedUser"
              name="selectedUser"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-bold mb-2">
            Email Body
          </label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-red-400 to-amber-200 text-black font-semibold p-3 rounded mb-5"
        >
          Send Email
        </button>
      </form>
    </div>
    <ToastContainer/>
  </div>
  );
};

export default SendEmails;
