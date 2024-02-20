import "./App.css";
import React from "react";
import { RouterProvider, createBrowserRouter, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Routes from "./Routes";
import Body from "./Components/Body";
import AboutUs from "./Pages/AboutUs";
import Login from "./user/Login";
import SignUp from "./user/SignUp";
import AdminLogin from "./Admins/AdminLogin";
import AdminSignup from "./Admins/AdminSignup";
import DashBoard from "./DashBoard/DashBoard";
import NotableAlumni from "./Pages/NotableAlumni";
import EmailVerify from "./Admins/EmailVerify";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./DashBoard/AdminDashboard";
import HomeSection from "./user/HomeSection";
import UpdateProfile from "./user/UpdateProfile";
import SearchUser from "./user/SearchUser";
import Community from "./Components/Community";
import UserPost from "./Components/UserPost";
import UserProfile from "./user/UserProfile";
import CreatePost from "./Components/CreatePost";
import Faq from "./Faq/Faq";
import AnswerFaq from "./Faq/AnswerFaq";
import AdminSearch from "./Admins/AdminSearch";
import SendEmails from "./Admins/SendEmails";
import UploadNotice from "./Admins/UploadNotice";
import Notifications from "./user/Notifications";
import ResetPassword from "./user/ResetPassword";
import ForgotPassword from "./user/ForgotPassword";
import AdminResetpass from "./Admins/AdminResetpass";
import AdminForgotPass from "./Admins/AdminForgotpass";
import UserPassword from "./user/UserPassword";


const UserPrivateRoute = ({ element }) => {
  const { isUserLoggedIn } = useContext(AuthContext);

  return isUserLoggedIn ? element : <Navigate to="/login" replace={true} />;
};

const AdminPrivateRoute = ({ element }) => {
  const { isAdminLoggedIn } = useContext(AuthContext);

  return isAdminLoggedIn ? element : <Navigate to="/login" replace={true} />;
};

const router = createBrowserRouter([
  {path:"/forgotpassword/:id/:token", element:<ForgotPassword/>},
  { path: "/admin/verifyEmail/:token", element: <EmailVerify /> },
  { path: "/dashboard", element: <UserPrivateRoute element={<DashBoard />} /> },
  
  {
    path: "/",
    element: <Routes />,
    children: [
      { index: true, element: <Body /> },
      { path: "/notable-alumni", element: <NotableAlumni /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/login", element: <Login /> },
      {path:"/resetpassword",element:<ResetPassword/>},
      { path: "/signup", element: <SignUp /> },
      { path: "/admin-login", element: <AdminLogin /> },
      { path: "/admin-signup", element: <AdminSignup /> },
      {path:"/adminresetpass",element:<AdminResetpass/>},
      {path:"/adminforgotpass",element:<AdminForgotPass/>},
    ],
  },
  {
    path:"/notifications",
    element:<UserPrivateRoute element={<Notifications/>}/>

  },
  {
    path: "/home/:user_id",
    element: <UserPrivateRoute element={<HomeSection />} />,
  },
  {
    path: "/:user_id/update",
    element: <UserPrivateRoute element={<UpdateProfile />} />,
  },
  { path: "/search", element: <UserPrivateRoute element={<SearchUser />} /> },
  { path: "/community", element: <UserPrivateRoute element={<Community />} /> },
  {
    path: "/createpost",
    element: <UserPrivateRoute element={<CreatePost />} />,
  },

  {
    path: "/post/:post_id",
    element: <UserPrivateRoute element={<UserPost />} />,
  },

  {
    path: "/userprofile/:user_id",
    element: <UserPrivateRoute element={<UserProfile />} />,
  },

  {
    path: "/userprofile/:user_id",
    element: <UserPrivateRoute element={<UserProfile />} />,
  },
  {
    path:"/userpassword/:user_id",
    element:<UserPrivateRoute element={<UserPassword/>}/>,
  },
  { path: "/faq", element: <UserPrivateRoute element={<Faq />} /> },

  {
    path: "/admin-dashboard",
    element: <AdminPrivateRoute element={<AdminDashboard />} />,
  },
  {
    path: "/answerfaq",
    element: <AdminPrivateRoute element={<AnswerFaq />} />,
  },
  {
    path:"/adminsearch",
    element:<AdminPrivateRoute element = {<AdminSearch/>}/>,
  },
  {
    path:"/sendemail",
    element:<AdminPrivateRoute element={<SendEmails/>}/>,
  },
  {
    path:"/uploadnotice",
    element:<AdminPrivateRoute element={<UploadNotice/>}/>,
  }
]);


function App() {
  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  );
}

export default App;
