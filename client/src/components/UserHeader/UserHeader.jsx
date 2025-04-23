import React, { useState } from "react";
import { FaSun, FaMoon, FaBell, FaUserCircle } from "react-icons/fa";
import "./UserHeader.css";

const UserHeader = ({ toggleTheme, isDarkMode }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotificationMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="user-header">
      <div className="header-left">
        <h1>Welcome, User!</h1>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="notification-icon" onClick={toggleNotificationMenu}>
          <FaBell />
          {isNotificationOpen && (
            <div className="notification-menu">
              <ul>
                <li>New order received</li>
                <li>Feedback submitted</li>
              </ul>
            </div>
          )}
        </div>
        <div className="profile-icon" onClick={toggleProfileMenu}>
          <FaUserCircle />
          {isProfileOpen && (
            <div className="profile-menu">
              <ul>
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

export default UserHeader;