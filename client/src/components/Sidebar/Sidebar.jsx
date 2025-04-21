import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaUsers, FaShoppingCart, FaChartLine, FaEnvelope, FaCog, FaPowerOff, FaComment, FaBoxOpen } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/logout-animation"); // Redirect to the LogoutAnimation component
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-brand">
        <h2>AdminHub</h2>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? "◄" : "►"}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/admin-dashboard/users">
            <FaUser />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/employees">
            <FaUsers />
            <span>Employees</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/orders">
            <FaShoppingCart />
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/sales">
            <FaChartLine />
            <span>Sales</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/notifications">
            <FaEnvelope />
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/feedback">
            <FaComment />
            <span>Feedback</span>
          </Link>
        </li>
        <li>
          <Link to="/admin-dashboard/settings">
            <FaCog />
            <span>Settings</span>
          </Link>
        </li>

        {/* ➕ New Inventory / Products Section */}
        <li>
          <Link to="/admin-dashboard/products">
            <FaBoxOpen />
            <span>Inventory</span>
          </Link>
        </li>

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

export default Sidebar;