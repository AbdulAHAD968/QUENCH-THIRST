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
      status: "Pending", // Pending, Delivered, Processing, Cancelled
    },
    {
      id: 2,
      customerName: "Jane Smith",
      date: "2023-10-02",
      location: "456 Elm St",
      status: "Delivered",
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      date: "2023-10-03",
      location: "789 Oak St",
      status: "Processing",
    },
    {
      id: 4,
      customerName: "Bob Brown",
      date: "2023-10-04",
      location: "321 Pine St",
      status: "Cancelled",
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