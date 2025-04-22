import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import "./Employees.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        });
  
        // Only keep users with role 'employee'
        const customerUsers = (data || []).filter(user => user.role === "employee");
        setUsers(customerUsers);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        setUsers([]);
      }
    };
  
    fetchUsers();
  }, []);  

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formMode === "edit") {
        // Update existing user
        const { data } = await axios.put(
          `http://localhost:5000/api/users/${currentUserId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        );
        setUsers(users.map((user) => 
          user._id === currentUserId ? data.user : user
        ));
      } 
      else{
        const { data } = await axios.post(
          "http://localhost:5000/api/users",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        );
        setUsers([...users, data.user]);
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  const openEditForm = (user) => {
    setFormMode("edit");
    setCurrentUserId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role || "user"
    });
  };

  const openAddForm = () => {
    setFormMode("add");
    setCurrentUserId(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "employee"
    });
  };

  const closeForm = () => {
    setFormMode(null);
    setCurrentUserId(null);
    setError("");
  };

  if (loading){
    return <div className="loading">Loading users...</div>;
  }
  if (error){
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users">
      <div className="users-header">
        <h2>Employee Management</h2>
        <button onClick={openAddForm} className="btn-add">
          <FaPlus /> Add Employee
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {users
            .filter((u) => u && u.username && u.email && u.role) // only valid users
            .map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="actions">
                  <button onClick={() => openEditForm(user)} className="btn-edit">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteUser(user._id)} className="btn-delete">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form for Add/Edit */}
      {formMode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="user-form-container">
              <h2>{formMode === "edit" ? "Edit User" : "Add New User"}</h2>
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label> 
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    {formMode === "edit" ? "New Password (leave blank to keep current)" : "Password"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={formMode === "add"}
                    minLength={formMode === "add" ? 6 : 0}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    <FaSave /> {loading ? "Processing..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="cancel-btn"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;