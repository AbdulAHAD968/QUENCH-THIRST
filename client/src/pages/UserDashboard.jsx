import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import UserHeader from "../components/UserHeader/UserHeader";
import AvailableItems from "../components/AvailableItems/AvailableItems";
import TodoList from "../components/TodoList/TodoList";
import OrderHistory from "../components/OrderHistory/OrderHistory";
import Feedback from "../components/Feedback/UserFeedback";
// import PlaceOrder from "../components/PlaceOrder/PlaceOrder";
import Settings from "../components/Settings/UserSettings";
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
            <Route path="/" element={<AvailableItems />} /> {/* Default landing page */}
            <Route path="/history" element={<OrderHistory />} /> {/* Order History */}
            <Route path="/todo" element={<TodoList />} /> {/* Todo List */}
            <Route path="/feedback" element={<Feedback />} /> {/* Feedback */}
            <Route path="/settings" element={<Settings />} /> {/* Settings */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;