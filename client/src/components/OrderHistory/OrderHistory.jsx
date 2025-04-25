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
import "./OrderHistory.css";

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

const OrderHistory = () => {
  
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [orderedItemsData, setOrderedItemsData] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);


  useEffect(() => {
    const fetchUserOrderHistory = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
  
        const { data } = await axios.get('/api/orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
  
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format");
        }
  
        // 🛠 Proper filtering
        const filteredOrders = data.filter(order => order.user === user._id);
  
        // ✅ Use the filtered data
        setOrders(filteredOrders);
        setTotalOrders(filteredOrders.length);
  
        const total = filteredOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        setTotalSales(total);
  
        processChartData(filteredOrders);
      }
      catch (err) {
        console.error("Error fetching user orders:", err);
        setError(err.response?.data?.message || "Failed to load order history");
      }
      finally {
        setLoading(false);
      }
    };
  
    fetchUserOrderHistory();
  }, []);  

  const processChartData = (orders) => {
    if (!orders || orders.length === 0) return;

    // Process spending data by time period
    const weeklyData = processDataByPeriod(orders, 'week');
    const monthlyData = processDataByPeriod(orders, 'month');
    const yearlyData = processDataByPeriod(orders, 'year');

    setSpendingData({
      weekly: weeklyData,
      monthly: monthlyData,
      yearly: yearlyData
    });

    // Process most ordered items
    const itemsData = processOrderedItems(orders);
    setOrderedItemsData(itemsData);
  };

  const processDataByPeriod = (orders, period) => {
    const periodMap = new Map();
    const now = new Date();

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      let periodKey;

      if (period === 'week') {
        // Group by week
        const weekStart = new Date(orderDate);
        weekStart.setDate(orderDate.getDate() - orderDate.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else if (period === 'month') {
        // Group by month
        periodKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
      } else {
        // Group by year
        periodKey = orderDate.getFullYear().toString();
      }

      periodMap.set(periodKey, (periodMap.get(periodKey) || 0) + order.totalPrice);
    });

    // Sort periods chronologically
    const sortedPeriods = Array.from(periodMap.entries()).sort((a, b) => {
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
    } else if (period === 'month') {
      labels = sortedPeriods.map(([key]) => {
        const [year, month] = key.split('-');
        return new Date(year, month).toLocaleDateString('default', { month: 'short', year: 'numeric' });
      });
    } else {
      labels = sortedPeriods.map(([year]) => year);
    }

    return {
      labels,
      datasets: [{
        label: "Amount Spent (Rs)",
        data: sortedPeriods.map(([_, total]) => total),
        backgroundColor: "#3C91E6",
        borderColor: "#3C91E6",
        borderWidth: 1,
      }]
    };
  };

  const processOrderedItems = (orders) => {
    const itemMap = new Map();
    
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const itemName = item.name || `Product ${item.product}`;
        itemMap.set(itemName, (itemMap.get(itemName) || 0) + item.quantity);
      });
    });

    const sortedItems = Array.from(itemMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4); // Get top 4 items

    return {
      labels: sortedItems.map(([name]) => name),
      datasets: [{
        label: "Quantity Ordered",
        data: sortedItems.map(([_, quantity]) => quantity),
        backgroundColor: ["#3C91E6", "#4CAF50", "#FF6384", "#FFCE56"],
        borderColor: ["#3C91E6", "#4CAF50", "#FF6384", "#FFCE56"],
        borderWidth: 1,
      }]
    };
  };

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
        callbacks: {
          label: function(context) {
            return `Rs. ${context.parsed.y.toFixed(2)}`;
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
          text: "Amount Spent (Rs)",
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `Rs. ${value}`;
          }
        }
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
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} units`;
          }
        }
      },
    },
  };

  if (loading) return <div className="loading">Loading order history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-history">
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

      {/* Spending Chart */}
      {spendingData && (
        <div className="chart-container">
          <Bar data={spendingData[timePeriod]} options={barChartOptions} />
        </div>
      )}

      {/* Ordered Items Pie Chart */}
      {orderedItemsData && (
        <div className="chart-container">
          <Pie data={orderedItemsData} options={pieChartOptions} />
        </div>
      )}

      {/* Order History Table */}
      <div className="order-table">
        <h3>Order Details</h3>
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total (Rs)</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.name || `Product ${item.product}`}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td>Rs. {order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                      {order.paymentMethod}
                    </span>
                    <br />
                    {order.isPaid ? 'Paid' : 'Paid'}
                  </td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;