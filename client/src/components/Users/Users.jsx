import React, { useState } from "react";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", waterOrdered: 500, address: "123 Main St" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", waterOrdered: 300, address: "456 Elm St" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", waterOrdered: 700, address: "789 Oak St" },
  ]);

  const removeUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="users">
      <h2>Users Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Water Ordered (L)</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.waterOrdered}</td>
              <td>{user.address}</td>
              <td>
                <button onClick={() => removeUser(user.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;