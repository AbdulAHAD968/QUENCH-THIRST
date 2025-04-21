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

const UserDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;