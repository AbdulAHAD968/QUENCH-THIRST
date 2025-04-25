import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryTracking.css';
import Loader from './Loader';

// SVG Icons for the animation
const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3498db" width="140" height="140">
    <path d="M22 21V7.174l-10-7.5-10 7.5V21h4v-2h12v2h4zm-6-10h-8v8h8v-8z" />
    <path fill="#2980b9" d="M12 11h2v2h-2zm-2 0h2v2h-2zm4 0h2v2h-2zm-2-4h2v2h-2z" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" width="140" height="140">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    <path fill="#c0392b" d="M12 8l-6 4.5V18h4v-4h4v4h4v-5.5z" />
  </svg>
);

const DeliveryTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingOrderId, setShippingOrderId] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [truckPosition, setTruckPosition] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch orders';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleShipOrder = async (orderId) => {
    setShippingOrderId(orderId);
    setShowAnimation(true);
    setTruckPosition(0);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // First update order status
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status: 'Shipped' },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Create employee shipping record
      await axios.post(
        `/api/employee-shipping`,
        { 
          orderId,
          employeeId: user._id,
          deliveryTime: 2
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const animationDuration = 3750;
      const startTime = Date.now();
      
      const animateTruck = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        setTruckPosition(progress * 50);
        
        if (progress < 1) {
          requestAnimationFrame(animateTruck);
        }
        else {
          setTimeout(async () => {
            await axios.put(
              `/api/orders/${orderId}/status`,
              { status: 'Delivered' },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            await axios.put(
              `/api/employee-shipping/${orderId}`,
              { status: 'Delivered' },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setOrders(prevOrders =>
              prevOrders.map(order =>
                order._id === orderId ? { ...order, status: 'Delivered' } : order
              )
            );
            
            toast.success(`Order #${orderId.slice(-6)} shipped successfully! 🚛`);
            setShowAnimation(false);
            setShippingOrderId(null);
          }, 500);
        }
      };
      animateTruck();
    }
    catch (err) {
      console.error('Error updating status:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      toast.error(errorMsg);
      setShowAnimation(false);
      setShippingOrderId(null);
    }
  };

  const processingOrders = orders.filter((order) => order.status === 'Processing');

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Orders Ready for Shipping</h2>
      {processingOrders.length === 0 ? (
        <div className="empty-state">
          No orders currently in processing.
          {orders.length > 0 && ` (Total orders: ${orders.length})`}
        </div>
      ) : (
        <div className="orders-list">
          {processingOrders.map((order) => (
            <div className="order-card" key={order._id}>
              {/* Order card content remains the same */}
              <div className="order-header">
                <span className="order-number">Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className="customer-name">
                  {order.deliveryAddress?.fullName || 'Customer'}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span>Items:</span>
                  <span>{order.orderItems.length}</span>
                </div>
                <div className="detail-item">
                  <span>Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span>Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                className="action-button"
                onClick={() => handleShipOrder(order._id)}
                disabled={shippingOrderId !== null}
              >
                Mark as Shipped
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Full-screen shipping animation */}
      {showAnimation && (
        <div className="shipping-animation-overlay">
          <div className="road-background">
            <div className="sky"></div>
            <div className="grass"></div>
            <div className="road"></div>
            <div className="road-line"></div>
          </div>
          
          <div className="shipping-animation-container">
            <div className="location-icon source">
              <WarehouseIcon />
              <div className="location-label">Our Warehouse</div>
            </div>
            
            <div className="truck-container" style={{ left: `${truckPosition}%` }}>
              <div className="moving-truck">
                <div className="truck-body">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" className="trucksvg">
                  <path strokeWidth={3} stroke="#282828" fill="#3A86FF" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
                  <path strokeWidth={3} stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
                  <path strokeWidth={2} stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
                  <rect strokeWidth={2} stroke="#282828" fill="#FFFCAB" rx={1} height={7} width={5} y={63} x={187} />
                  <rect strokeWidth={2} stroke="#282828" fill="#282828" rx={1} height={11} width={4} y={81} x={193} />
                  <rect strokeWidth={3} stroke="#282828" fill="#DFDFDF" rx="2.5" height={90} width={121} y="1.5" x="6.5" />
                  <rect strokeWidth={2} stroke="#282828" fill="#DFDFDF" rx={2} height={4} width={6} y={84} x={1} />
                  <rect strokeWidth={2} stroke="#282828" fill="#3A86FF" rx="1.5" height={30} width={40} y={15} x={50} />
                  <path strokeWidth={2} stroke="#282828" fill="#3A86FF" d="M90 15V45H50V15C50 15 55 10 70 10C85 10 90 15 90 15Z" />
                  <circle strokeWidth={1} stroke="#282828" fill="#FFFFFF" r={3} cy={30} cx={65} />
                </svg>
                </div>
                <div className="truck-tires">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tire-svg">
                    <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                    <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="tire-svg">
                    <circle strokeWidth={3} stroke="#282828" fill="#282828" r="13.5" cy={15} cx={15} />
                    <circle fill="#DFDFDF" r={7} cy={15} cx={15} />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="location-icon destination">
              <HomeIcon />
              <div className="location-label">Customer</div>
            </div>
          </div>
          
          <div className="clouds">
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
            <div className="cloud"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;