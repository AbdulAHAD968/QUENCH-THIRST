import React, { useState } from "react";
import axios from "axios";
import Logout from "../components/Logout";

const AdminPanel = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/create-admin", { username, email, password });
      console.log(response.data);
      alert("Admin created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create admin!");
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleCreateAdmin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Create Admin</button>
      </form>
      <Logout />
    </div>
  );
};

export default AdminPanel;