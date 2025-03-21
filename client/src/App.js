import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return !!user; // Returns true if user exists
};

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin";
};

const isEmployee = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "employee";
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/user-dashboard"
          element={isAuthenticated() ? <UserDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/employee-dashboard"
          element={isEmployee() ? <EmployeeDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/admin-dashboard"
          element={isAdmin() ? <AdminDashboard /> : <Navigate to="/auth" />}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;