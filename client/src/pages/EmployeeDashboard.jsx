import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeSidebar from "../components/Employee/EmployeeSidebar/EmployeeSidebar";
import EmployeeHeader from "../components/Employee/EmployeeHeader/EmployeeHeader";
// import OrderManagement from "../components/Employee/OrderManagement/OrderManagement";
// import DeliveryTracking from "../components/Employee/DeliveryTracking/DeliveryTracking";
// import ComplaintManagement from "../components/Employee/ComplaintManagement/ComplaintManagement";
// import PerformanceMetrics from "../components/Employee/PerformanceMetrics/PerformanceMetrics";
// import EmployeeSettings from "../components/Employee/EmployeeSettings/EmployeeSettings";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
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
    <div className={`employee-dashboard ${isDarkMode ? "dark" : ""}`}>
      <EmployeeSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "" : "sidebar-closed"}`}>
        <EmployeeHeader toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="content">
          <Routes>
            {/* <Route path="/" element={<OrderManagement />} /> */}
            {/* <Route path="/orders" element={<OrderManagement />} />
            <Route path="/deliveries" element={<DeliveryTracking />} />
            <Route path="/complaints" element={<ComplaintManagement />} />
            <Route path="/performance" element={<PerformanceMetrics />} />
            <Route path="/settings" element={<EmployeeSettings />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;