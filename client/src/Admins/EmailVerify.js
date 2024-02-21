import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../utils/constants";

const EmailVerify = ({ mobileNo, verificationToken }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/verifyEmail/${mobileNo}/${verificationToken}`, {
          responseType: 'text',
        });

        if (response.data.success) {
          console.log("Email verified successfully!");
          setVerificationStatus('success');
          setMsg("Email verified successfully! You can now go to the login page and login.")
          navigate("/admin-login");
        } else {
          console.error("Error verifying email:", response.data.message);
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error("Error verifying email:", error.message);
        setVerificationStatus('error');
        setMsg("Email verification failed. Please try again.");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      console.error("Token not found in the URL");
      setVerificationStatus('error');
    }
  }, [token, navigate, mobileNo, verificationToken]);

  return (
    <div>
      {verificationStatus === 'success' && <p>{msg}</p>}
      {verificationStatus === 'error' && <p>{msg}</p>}
    </div>
  );
};

export default EmailVerify;
