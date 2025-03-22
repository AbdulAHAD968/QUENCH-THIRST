import React, { useState } from "react";
import "./Employees.css";

const Employees = () => {
  // Sample employee data (replace with API call later)
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Delivery", contact: "123-456-7890" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager", contact: "987-654-3210" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Support", contact: "555-555-5555" },
  ]);

  // Function to remove an employee
  const removeEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  return (
    <div className="employees">
      <h2>Employees Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.contact}</td>
              <td>
                <button onClick={() => removeEmployee(employee.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;