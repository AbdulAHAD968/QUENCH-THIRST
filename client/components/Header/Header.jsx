import React, { useState } from "react";
import { FaSun, FaMoon, FaBell, FaUserCircle } from "react-icons/fa";
import "./Header.css";

const Header = ({ toggleTheme, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New order received from John Doe", read: false },
    { id: 2, message: "User feedback submitted by Jane Smith", read: false },
    { id: 3, message: "System update completed successfully", read: true },
  ]);

  const unreadNotifications = notifications.filter((notification) => !notification.read).length;

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>Welcome, Admin!</h1>
      </div>
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="notification-icon">
          <FaBell />
          {unreadNotifications > 0 && <span className="notification-count">{unreadNotifications}</span>}
        </div>
        <div className="profile" onClick={toggleProfileMenu}>
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

export default Header;