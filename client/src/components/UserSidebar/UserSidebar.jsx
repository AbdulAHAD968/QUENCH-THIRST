import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaHistory, FaComment , FaList , FaCog, FaPowerOff } from "react-icons/fa";
import "./UserSidebar.css";

const UserSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/logout-animation"); // Redirect to the LogoutAnimation component
  };

  // Define menu items
  const menuItems = [
    { path: "/user-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/user-dashboard/orders", icon: <FaShoppingCart />, label: "Place Order" },
    { path: "/user-dashboard/history", icon: <FaHistory />, label: "Order History" },
    { path: "/user-dashboard/feedback", icon: <FaComment />, label: "Feedback" },
    { path: "/user-dashboard/settings", icon: <FaCog />, label: "Settings" },
    { path: "/user-dashboard/todo", icon: <FaList />, label: "Todo List" }, // New Todo List ent
  ];

  return (
    <div className={`user-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-brand">
        <h2>UserHub</h2>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "◄" : "►"}
        </button>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className="logout-button">
            <FaPowerOff />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;