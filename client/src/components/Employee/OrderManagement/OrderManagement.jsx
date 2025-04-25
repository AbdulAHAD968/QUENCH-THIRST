import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        
        const { data } = await axios.get('/api/orders', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        setOrders(data);
        toast.success('Orders loaded successfully');
      } catch (err) {
        console.error("Error fetching orders:", err);
        const errorMsg = err.response?.data?.message || "Failed to load orders";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const { data } = await axios.put(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      setOrders(orders.map(order => 
        order._id === orderId ? data : order
      ));
      setSelectedOrder(null);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      const errorMsg = err.response?.data?.message || "Failed to update status";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      toast.info('Order deletion cancelled');
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.delete(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      if (response.data.message === 'Order removed') {
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success('Order deleted successfully');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete order";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const filteredOrders = selectedStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#FFA500";
      case "Processing": return "#1E90FF";
      case "Shipped": return "#9370DB";
      case "Delivered": return "#32CD32";
      case "Cancelled": return "#FF4500";
      default: return "#A9A9A9";
    }
  };

  const getPaymentColor = (method) => {
    switch (method) {
      case "COD": return "#FF8C00";
      case "Card": return "#4169E1";
      case "UPI": return "#800080";
      case "Wallet": return "#228B22";
      default: return "#A9A9A9";
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders">
      <h2>Order Management</h2>
      
      <div className="filters">
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>
                      {order.user?.name || "Unknown"}
                      <div className="address">
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {order.orderItems.length} item(s)
                      <button 
                        className="view-items"
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        {selectedOrder?._id === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                    <td>Rs. {order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span 
                        className="payment-badge"
                        style={{ backgroundColor: getPaymentColor(order.paymentMethod) }}
                      >
                        {order.paymentMethod}
                      </span>
                      <div>{order.isPaid ? "Paid" : "Not Paid"}</div>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="actions">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteOrder(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedOrder?._id === order._id && (
                    <tr className="order-details">
                      <td colSpan="8">
                        <div className="details-container">
                          <h4>Order Details</h4>
                          <div className="order-items">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="item">
                                <div className="item-name">{item.name}</div>
                                <div className="item-quantity">Qty: {item.quantity}</div>
                                <div className="item-price">Rs. {item.price.toFixed(2)} each</div>
                                <div className="item-total">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          <div className="delivery-address">
                            <h4>Delivery Address</h4>
                            <p>{order.deliveryAddress?.street}</p>
                            <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                            <p>{order.deliveryAddress?.postalCode}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;