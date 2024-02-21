import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState(undefined);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(undefined);
  const [userLoading, setUserLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  const checkUserLoginStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsUserLoggedIn(false);
        setLoggedInUserDetails(null);
        setUserLoading(false);
        return;
      }

      const userLoggedInRes = await axios.get(
        `${BASE_URL}/users/userloggedin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userLoggedInRes.data.success) {
        setIsUserLoggedIn(true);

        const userResponse = await axios.get(
          `${BASE_URL}/users/userlogged`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLoggedInUserDetails(userResponse.data);
      } else {
        localStorage.removeItem("token");
        setIsUserLoggedIn(false);
        setLoggedInUserDetails(null);
      }
    } catch (error) {
      console.error("Error checking user login status:", error);
      setIsUserLoggedIn(false);
      setLoggedInUserDetails(null);
    } finally {
      setUserLoading(false);
    }
  };

  const checkAdminLogin = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setIsAdminLoggedIn(false);
        setAdminLoading(false);
        return;
      }

      const adminLoggedInRes = await axios.get(
        `${BASE_URL}/admin/adminLoggedIn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (adminLoggedInRes.data.success) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking admin login status:", error);
      setIsAdminLoggedIn(false);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoginStatus();
    checkAdminLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn,
        checkUserLoginStatus,
        loggedInUserDetails,
        checkAdminLogin,
        isAdminLoggedIn,
        userLoading,
        adminLoading,
      }}
    >
      {!userLoading && !adminLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
