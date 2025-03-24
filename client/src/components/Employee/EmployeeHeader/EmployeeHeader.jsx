import React, { useState } from "react";
import { FaSun, FaMoon, FaBell, FaUserCircle } from "react-icons/fa";
import "./EmployeeHeader.css";

const EmployeeHeader = ({ toggleTheme, isDarkMode }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotificationMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Sample employee notifications
  const notifications = [
    "New order #1234 assigned",
    "Delivery request for area A",
    "Complaint ticket #567 opened"
  ];

  return (
    <div className="employee-header">
      <div className="header-left">
        <h1>Employee Dashboard</h1>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="notification-icon" onClick={toggleNotificationMenu}>
          <FaBell />
          <span className="badge">3</span>
          {isNotificationOpen && (
            <div className="notification-menu">
              <h4>Notifications</h4>
              <ul>
                {notifications.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="profile-icon" onClick={toggleProfileMenu}>
          <FaUserCircle />
          {isProfileOpen && (
            <div className="profile-menu">
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;