// UserDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import UserHeader from "../components/UserHeader/UserHeader";
import AvailableItems from "../components/AvailableItems/AvailableItems";
import TodoList from "../components/TodoList/TodoList";
import OrderHistory from "../components/OrderHistory/OrderHistory";
import Feedback from "../components/Feedback/UserFeedback";
import Settings from "../components/Settings/UserSettings";
import PlaceOrder from '../components/placeOrder/PlaceOrder';
import "./UserDashboard.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id; // Get the user ID

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", !isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="user-dashboard">
      
      <UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`main-content ${isSidebarOpen ? "" : "sidebar-closed"}`}>
      
        <UserHeader toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
        <div className="content">
      
          <Routes>
            <Route path="/" element={<AvailableItems />} />
            <Route path="/placeOrder" element={<PlaceOrder />} />
            <Route path="/history" element={<OrderHistory />} /> 
            <Route path="/todo" element={<TodoList />} />
            <Route path="/feedback" element={<Feedback />} /> 
            <Route path="/settings" element={<Settings userId={userId} />} />
          </Routes>
      
        </div>
      
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default UserDashboard;