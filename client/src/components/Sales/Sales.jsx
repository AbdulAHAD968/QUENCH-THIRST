import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from "chart.js";
import 'chartjs-adapter-date-fns'; // Lightweight date adapter
import axios from "axios";
import "./Sales.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  TimeScale
);

const Sales = () => {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        const { data } = await axios.get('/api/orders/admin/sales-analytics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!data.orders || !Array.isArray(data.orders)) {
          throw new Error("Invalid data format received");
        }
        
        // Process the data
        const processedData = processSalesData(data.orders, timePeriod);
        setSalesData(processedData);
        
        // Use the calculated totals from the backend
        setTotalSales(data.totalSales);
        setTotalOrders(data.totalOrders);
        
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError(err.response?.data?.message || "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalesData();
  }, [timePeriod]);

  const processSalesData = (orders, period) => {
    // Group orders by time period
    const groups = {};
    const now = new Date();
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      let key;
      
      if (period === "weekly") {
        // Get start of week (Sunday)
        const day = orderDate.getDay();
        const diff = orderDate.getDate() - day;
        const weekStart = new Date(orderDate.setDate(diff));
        key = weekStart.toISOString().split('T')[0];
      } 
      else if (period === "monthly") {
        key = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
      } 
      else if (period === "yearly") {
        key = orderDate.getFullYear().toString();
      }
      
      if (!groups[key]) {
        groups[key] = 0;
      }
      groups[key] += order.totalPrice;
    });
    
    // Sort groups by date
    const sortedGroups = Object.entries(groups).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });
    
    // Prepare chart data
    const labels = sortedGroups.map(([key]) => {
      if (period === "weekly") return `Week of ${key.split('T')[0]}`;
      if (period === "monthly") {
        const [year, month] = key.split('-');
        return new Date(year, month).toLocaleString('default', { month: 'short' });
      }
      return key; // year
    });
    
    const dataPoints = sortedGroups.map(([_, total]) => total);
    
    return {
      labels,
      datasets: [{
        label: "Sales",
        data: dataPoints,
        backgroundColor: "#3C91E6",
        borderColor: "#3C91E6",
        borderWidth: 1,
        tension: 0.1
      }]
    };
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
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timePeriod === "weekly" ? "Week" : timePeriod === "monthly" ? "Month" : "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales (USD)",
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value}`;
          }
        }
      },
    },
  };

  if (loading) return <div className="loading">Loading sales data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="sales">
      <h2>Sales Analytics Dashboard</h2>
      
      <div className="sales-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p>${totalSales.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Order Value</h3>
          <p>${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0}</p>
        </div>
      </div>

      <div className="controls">
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
        
        <div className="chart-type-toggle">
          <button
            className={chartType === "bar" ? "active" : ""}
            onClick={() => setChartType("bar")}
          >
            Bar Chart
          </button>
          <button
            className={chartType === "line" ? "active" : ""}
            onClick={() => setChartType("line")}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="chart-container">
        {chartType === "bar" ? (
          <Bar data={salesData} options={options} />
        ) : (
          <Line data={salesData} options={options} />
        )}
      </div>
    </div>
  );
};

export default Sales;