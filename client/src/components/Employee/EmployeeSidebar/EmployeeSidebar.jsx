import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaClipboardList, 
  FaTruck, 
  FaExclamationTriangle, 
  FaChartLine,
  FaCog, 
  FaPowerOff 
} from "react-icons/fa";
import "./EmployeeSidebar.css";

const EmployeeSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("employee"); // Clear employee data
    navigate("/logout-animation");
  };

  // Define menu items specific to employee
  const menuItems = [
    { path: "/employee-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/employee-dashboard/orders", icon: <FaClipboardList />, label: "Order Management" },
    { path: "/employee-dashboard/deliveries", icon: <FaTruck />, label: "Deliveries" },
    { path: "/employee-dashboard/complaints", icon: <FaExclamationTriangle />, label: "FeedBack" },
    { path: "/employee-dashboard/performance", icon: <FaChartLine />, label: "Performance" },
    { path: "/employee-dashboard/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className={`employee-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-brand">
        <h2>EmployeeHub</h2>
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

export default EmployeeSidebar;