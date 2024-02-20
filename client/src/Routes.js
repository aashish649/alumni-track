
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Routes />,
//     children: [
//       {
//         path: '',
//         element: <Body />,
//       },
//       {
//         path: '/notable-alumni',
//         element: <NotableAlumni />,
//       },
//       {
//         path: '/about-us',
//         element: <AboutUs />,
//       },
//       {
//         path: '/login',
//         element: <Login />,
//       },
//       {
//         path: '/signup',
//         element: <SignUp />,
//       },
//     ],
//   },
//   {
//     path: '/admin-login',
//     element: <AdminLogin />,
//   },
//   {
//     path: '/admin-signup',
//     element: <AdminSignup />,
//   },
//   {
//     path: '/dashboard',
//     element: <ProtectedRoute element={DashBoard} />,
//   },
// ]);

// export default router;




// routes.js
// import React, { useContext } from 'react';
// import { createBrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
// import AuthContext from './context/AuthContext';
// import NotableAlumni from "./Pages/NotableAlumni";








// export default router;

import React from "react";
import Header from "./Components/Header";
import DashBoard from "./DashBoard/DashBoard";
import { Outlet } from "react-router-dom";


const Routes = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>

    
  )
}

export default Routes;
