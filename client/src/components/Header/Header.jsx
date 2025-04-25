import React, { useState } from "react";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleTheme, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Or "admin" if stored as that
    navigate("/logout-animation");
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
        <div className="profile" onClick={toggleProfileMenu}>
          <FaUserCircle />
          {isProfileOpen && (
            <div className="profile-menu">
              <ul>
                <li>
                  <Link to="/admin-dashboard/settings">Settings</Link>
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

export default Header;
