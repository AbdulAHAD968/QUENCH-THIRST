import React from "react";

const Logout = () => {
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;