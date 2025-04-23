import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./OrderHistory.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const OrderHistory = () => {
  const [timePeriod, setTimePeriod] = useState("weekly"); // weekly, monthly, yearly

  // Sample data for water spending
  const waterSpendingData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Amount Spent (USD)",
          data: [20, 30, 25, 40, 35, 50, 45],
          backgroundColor: "#3C91E6",
          borderColor: "#3C91E6",
          borderWidth: 1,
        },
      ],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Amount Spent (USD)",
          data: [150, 200, 180, 250, 220, 300],
          backgroundColor: "#3C91E6",
          borderColor: "#3C91E6",
          borderWidth: 1,
        },
      ],
    },
    yearly: {
      labels: ["2019", "2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "Amount Spent (USD)",
          data: [1200, 1500, 1800, 2000, 2200],
          backgroundColor: "#3C91E6",
          borderColor: "#3C91E6",
          borderWidth: 1,
        },
      ],
    },
  };

  // Sample data for most ordered item
  const mostOrderedItemData = {
    labels: ["Mineral Water", "Sparkling Water", "Flavored Water", "Distilled Water"],
    datasets: [
      {
        label: "Quantity Ordered",
        data: [120, 80, 60, 40],
        backgroundColor: ["#3C91E6", "#4CAF50", "#FF6384", "#FFCE56"],
        borderColor: ["#3C91E6", "#4CAF50", "#FF6384", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  // Sample order history table data
  const orderHistory = [
    { id: 1, date: "2023-10-01", item: "Mineral Water", quantity: 10, amount: 20 },
    { id: 2, date: "2023-10-02", item: "Sparkling Water", quantity: 5, amount: 15 },
    { id: 3, date: "2023-10-03", item: "Flavored Water", quantity: 8, amount: 24 },
    { id: 4, date: "2023-10-04", item: "Distilled Water", quantity: 12, amount: 36 },
  ];

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  // Options for the bar chart
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Water Spending (${timePeriod})`,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timePeriod === "weekly" ? "Day" : timePeriod === "monthly" ? "Month" : "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount Spent (USD)",
        },
        beginAtZero: true,
      },
    },
  };

  // Options for the pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Most Ordered Items",
      },
    },
  };

  return (
    <div className="order-history">
      <h2>Order History</h2>

      {/* Time Period Toggle */}
      <div className="time-period-toggle">
        <button
          className={timePeriod === "weekly" ? "active" : ""}
          onClick={() => handleTimePeriodChange("weekly")}
        >
          Weekly
        </button>
        <button
          className={timePeriod === "monthly" ? "active" : ""}
          onClick={() => handleTimePeriodChange("monthly")}
        >
          Monthly
        </button>
        <button
          className={timePeriod === "yearly" ? "active" : ""}
          onClick={() => handleTimePeriodChange("yearly")}
        >
          Yearly
        </button>
      </div>

      {/* Water Spending Chart */}
      <div className="chart-container">
        <Bar data={waterSpendingData[timePeriod]} options={barChartOptions} />
      </div>

      {/* Most Ordered Item Pie Chart */}
      <div className="chart-container">
        <Pie data={mostOrderedItemData} options={pieChartOptions} />
      </div>

      {/* Order History Table */}
      <div className="order-table">
        <h3>Detailed Order History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => (
              <tr key={order.id}>
                <td>{order.date}</td>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;