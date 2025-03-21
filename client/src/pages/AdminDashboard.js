import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="dashboard">
      <h1>Welcome to {role} Dashboard</h1>
      <p>This is the dashboard for {role}s.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;