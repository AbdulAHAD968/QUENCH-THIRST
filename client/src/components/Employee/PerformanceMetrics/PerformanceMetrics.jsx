import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from "chart.js";
import axios from "axios";
import "./PerformanceMetrics.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

const PerformanceMetrics = ({ employeeId }) => {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [statusDistributionData, setStatusDistributionData] = useState(null);
  const [totalShipped, setTotalShipped] = useState(0);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState(0);

  useEffect(() => {
    const fetchEmployeeMetrics = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Fetch performance metrics
        const { data: metricsData } = await axios.get(`/api/employee-shipping/performance/${employeeId || user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // Fetch detailed shipping records for charts
        const { data: shippingRecords } = await axios.get(`/api/employee-shipping/${employeeId || user._id}/records`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        setMetrics(metricsData);
        setTotalShipped(metricsData?.totalOrders || 0);
        setAvgDeliveryTime(metricsData?.avgDeliveryTime || 0);

        processChartData(shippingRecords);
      } catch (err) {
        console.error("Error fetching employee metrics:", err);
        setError(err.response?.data?.message || "Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeMetrics();
  }, [employeeId]);

  const processChartData = (records) => {
    if (!records || records.length === 0) return;

    // Process delivery time data by time period
    const weeklyData = processDeliveryTimeData(records, 'week');
    const monthlyData = processDeliveryTimeData(records, 'month');
    const yearlyData = processDeliveryTimeData(records, 'year');

    setDeliveryData({
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData
    });

    // Process status distribution
    const statusData = processStatusDistribution(records);
    setStatusDistributionData(statusData);
  };

  const processDeliveryTimeData = (records, period) => {
    const periodMap = new Map();
    const countMap = new Map();

    records.forEach(record => {
      const recordDate = new Date(record.shippingDate);
      let periodKey;

      if (period === 'week') {
        // Group by week
        const weekStart = new Date(recordDate);
        weekStart.setDate(recordDate.getDate() - recordDate.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else if (period === 'month') {
        // Group by month
        periodKey = `${recordDate.getFullYear()}-${recordDate.getMonth()}`;
      } else {
        // Group by year
        periodKey = recordDate.getFullYear().toString();
      }

      // Sum delivery times and count records for average calculation
      periodMap.set(periodKey, (periodMap.get(periodKey) || 0) + (record.deliveryTime || 0));
      countMap.set(periodKey, (countMap.get(periodKey) || 0) + 1);
    });

    // Calculate averages and sort periods chronologically
    const sortedPeriods = Array.from(periodMap.entries())
      .map(([key, total]) => {
        const count = countMap.get(key);
        return [key, total / count]; // Calculate average
      })
      .sort((a, b) => {
        if (period === 'year') return a[0] - b[0];
        return new Date(a[0]) - new Date(b[0]);
      });

    // Format labels based on period
    let labels;
    if (period === 'week') {
      labels = sortedPeriods.map(([date]) => {
        const d = new Date(date);
        return `Week of ${d.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
      });
    } 
    else if (period === 'month') {
      labels = sortedPeriods.map(([key]) => {
        const [year, month] = key.split('-');
        return new Date(year, month).toLocaleDateString('default', { month: 'short', year: 'numeric' });
      });
    } 
    else {
      labels = sortedPeriods.map(([year]) => year);
    }

    return {
      labels,
      datasets: [{
        label: "Avg. Delivery Time (hours)",
        data: sortedPeriods.map(([_, avg]) => avg),
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
        borderWidth: 1,
      }]
    };
  };

  const processStatusDistribution = (records) => {
    const statusCounts = {
      'In Transit': 0,
      'Delivered': 0,
      'Returned': 0
    };

    records.forEach(record => {
      statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
    });

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: "Order Status Distribution",
        data: Object.values(statusCounts),
        backgroundColor: [
          "#FFC107", // In Transit - yellow
          "#4CAF50", // Delivered - green
          "#F44336"  // Returned - red
        ],
        borderColor: [
          "#FFC107",
          "#4CAF50",
          "#F44336"
        ],
        borderWidth: 1,
      }]
    };
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  // Options for the delivery time chart
  const deliveryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Average Delivery Time (${timePeriod})`,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(1)} hours`;
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
          text: "Delivery Time (hours)",
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `${value} hrs`;
          }
        }
      },
    },
  };

  // Options for the status distribution chart
  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Order Status Distribution",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      },
    },
  };

  if (loading) return <div className="loading">Loading performance metrics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="performance-metrics">
      <h2>Shipping Performance Dashboard</h2>
      {employeeId && <h3>Employee ID: {employeeId}</h3>}
      
      <div className="metrics-summary">
        <div className="summary-card">
          <h3>Total Orders Delivered</h3>
          <p>{totalShipped}</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Delivery Time</h3>
          <p>{avgDeliveryTime.toFixed(1)} hours</p>
        </div>
        <div className="summary-card">
          <h3>Delivery Success Rate</h3>
          <p>
            {metrics?.delivered && metrics?.totalOrders 
              ? `${Math.round((metrics.delivered / metrics.totalOrders) * 100)}%` 
              : 'N/A'}
          </p>
        </div>
        <div className="summary-card">
          <h3>Avg. Customer Rating</h3>
          <p>
            {metrics?.avgRating 
              ? `${metrics.avgRating.toFixed(1)}/5` 
              : 'Not rated'}
          </p>
        </div>
      </div>

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

      {/* Delivery Time Chart */}
      {deliveryData && (
        <div className="chart-container">
          <Bar 
            data={deliveryData[timePeriod]} 
            options={deliveryChartOptions} 
          />
        </div>
      )}

      {/* Status Distribution Pie Chart */}
      {statusDistributionData && (
        <div className="chart-container">
          <Pie 
            data={statusDistributionData} 
            options={statusChartOptions} 
          />
        </div>
      )}

      {/* Recent Shipping Activity */}
      <div className="shipping-activity">
        <h3>Recent Shipping Activity</h3>
        {metrics?.recentRecords?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Shipped On</th>
                <th>Delivery Time</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record.orderId.substring(0, 8)}...</td>
                  <td>{new Date(record.shippingDate).toLocaleDateString()}</td>
                  <td>{record.deliveryTime.toFixed(1)} hours</td>
                  <td>
                    <span className={`status ${record.status.toLowerCase().replace(' ', '-')}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {record.customerRating ? (
                      <div className="rating-stars">
                        {'★'.repeat(record.customerRating)}
                        {'☆'.repeat(5 - record.customerRating)}
                      </div>
                    ) : (
                      'Not rated'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No shipping records found</p>
        )}
      </div>
      
    </div>
  );
};

export default PerformanceMetrics;