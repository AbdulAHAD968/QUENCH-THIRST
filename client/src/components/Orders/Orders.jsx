import React from "react";
import "./Orders.css";

const Orders = () => {
  // Sample order data (replace with API call later)
  const orders = [
    {
      id: 1,
      customerName: "John Doe",
      date: "2023-10-01",
      location: "123 Main St",
      status: "Pending",
    },
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "Processing":
        return "blue";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="orders">
      <h2>Order Management</h2>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customerName}</td>
              <td>{order.date}</td>
              <td>{order.location}</td>
              <td>
                <span
                  className="status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;