import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Users from "../components/Users/Users";
import Employees from "../components/Employees/Employees";
import Orders from "../components/Orders/Orders";
import Sales from "../components/Sales/Sales";
import Notifications from "../components/Notifications/Notifications";
import Feedback from "../components/Feedback/Feedback";
import Settings from "../components/Settings/Settings"; // Import the Settings component
import DashboardOverview from "../components/DashboardOverview/DashboardOverview";
import "./AdminDashboard.css";

const AdminDashboard = () => {
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
    <div className="admin-dashboard">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "" : "sidebar-closed"}`}>
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="content">
          <Routes>
            <Route path="users" element={<Users />} /> {/* Users Management */}
            <Route path="employees" element={<Employees />} /> {/* Employees Management */}
            <Route path="orders" element={<Orders />} /> {/* Orders Management */}
            <Route path="sales" element={<Sales />} /> {/* Sales Management */}
            <Route path="notifications" element={<Notifications />} /> {/* Notifications Management */}
            <Route path="feedback" element={<Feedback />} /> {/* Feedback Management */}
            <Route path="settings" element={<Settings />} /> {/* Settings Management */}
            <Route path="/" element={<DashboardOverview />} /> {/* Default landing page */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;