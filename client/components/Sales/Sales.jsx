import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Sales.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Sales = () => {
  const [timePeriod, setTimePeriod] = useState("weekly"); // weekly, monthly, yearly

  // Sample sales data (replace with API call later)
  const salesData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Sales",
          data: [400, 600, 800, 700, 900, 1200, 1000],
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
          label: "Sales",
          data: [3000, 4000, 3500, 5000, 4500, 6000],
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
          label: "Sales",
          data: [50000, 60000, 70000, 80000, 90000],
          backgroundColor: "#3C91E6",
          borderColor: "#3C91E6",
          borderWidth: 1,
        },
      ],
    },
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Sales Data (${timePeriod})`,
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
          text: "Sales (USD)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="sales">
      <h2>Sales Record Management</h2>
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
      <div className="chart-container">
        <Bar data={salesData[timePeriod]} options={options} />
      </div>
    </div>
  );
};

export default Sales;