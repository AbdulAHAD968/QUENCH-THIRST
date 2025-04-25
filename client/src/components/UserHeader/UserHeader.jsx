import React, { useState } from "react";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./UserHeader.css";

const UserHeader = ({ toggleTheme, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/logout-animation");
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
        <div className="profile-icon" onClick={toggleProfileMenu}>
          <FaUserCircle />
          {isProfileOpen && (
            <div className="profile-menu">
              <ul>
                <li>
                  <Link to="/user-dashboard/settings">Settings</Link>
                </li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
