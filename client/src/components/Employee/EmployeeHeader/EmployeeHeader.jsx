import React, { useState } from "react";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./EmployeeHeader.css";

const EmployeeHeader = ({ toggleTheme, isDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    navigate("/logout-animation"); // redirect after logout
  };

  return (
    <div className="employee-header">
      <div className="header-left">
        <h1>Employee Dashboard</h1>
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
                  <Link to="/employee-dashboard/settings">Settings</Link>
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

export default EmployeeHeader;
