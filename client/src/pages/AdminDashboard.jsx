import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Users from "../components/Users/Users";
import Employees from "../components/Employees/Employees";
import Orders from "../components/Orders/Orders";
import Sales from "../components/Sales/Sales";
import Notifications from "../components/Notifications/Notifications";
import Feedback from "../components/Feedback/Feedback";
import Settings from "../components/Settings/Settings";
import DashboardOverview from "../components/DashboardOverview/DashboardOverview";
import ProductList from '../components/productList/ProductList';
import ProductForm from '../components/productList/ProductForm';
import "./AdminDashboard.css";

const AdminDashboard = () => {
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
    <div className="admin-dashboard">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "" : "sidebar-closed"}`}>
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="content">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="users" element={<Users />} />
          <Route path="employees" element={<Employees />} />
          <Route path="orders" element={<Orders />} />
          <Route path="sales" element={<Sales />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="settings" element={<Settings />} />
          <Route path="products" element={<ProductList isAdmin={true} />} />
          <Route path="add-product" element={<ProductForm editMode={false} />} />
          <Route path="edit-product/:id" element={<ProductForm editMode={true} />} />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;