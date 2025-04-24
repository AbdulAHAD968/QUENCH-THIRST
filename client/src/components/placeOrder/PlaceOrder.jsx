import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaCheck, FaTimes, FaCreditCard, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    walletNumber: ''
  });
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product === product._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        product: product._id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price
      }]);
    }
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product !== productId));
  };

  // Update quantity function
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item => 
      item.product === productId 
        ? { 
            ...item, 
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice
          } 
        : item
    ));
  };

  // Calculate totals
  const itemsPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryPrice = itemsPrice > 1000 ? 0 : 100;
  const totalPrice = itemsPrice + deliveryPrice;

  // Handle address change
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  // Handle payment details change
  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'Card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
        toast.error('Please fill all card details', {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
        return false;
      }
      if (paymentDetails.cardNumber.length !== 16) {
        toast.error('Card number must be 16 digits', {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
        return false;
      }
    } else if (paymentMethod === 'Wallet') {
      if (!paymentDetails.walletNumber) {
        toast.error('Please enter wallet number', {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
        return false;
      }
    } else if (paymentMethod === 'UPI') {
      if (!paymentDetails.upiId) {
        toast.error('Please enter UPI ID', {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
        return false;
      }
    }
    return true;
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!', {
        icon: <FaTimes style={{ color: '#dc3545' }} />,
        autoClose: 2000,
        position: 'top-right',
      });
      return;
    }
  
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      toast.error('Please fill in all address fields', {
        icon: <FaTimes style={{ color: '#dc3545' }} />,
        autoClose: 3000,
        position: 'top-right',
      });
      return;
    }
  
    // For non-COD methods, show payment form
    if (paymentMethod !== 'COD') {
      setShowPaymentForm(true);
      return;
    }
    
    // For COD, proceed directly to place order
    await submitOrder();
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const orderItems = cart.map(item => ({
        _id: item.product,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      }));

      const { data } = await axios.post('/api/orders', {
        userId: user._id,
        orderItems,
        deliveryAddress: address,
        paymentMethod,
        paymentDetails: paymentMethod !== 'COD' ? paymentDetails : null,
        itemsPrice,
        deliveryPrice,
        totalPrice
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      toast.success('Order placed successfully!', {
        icon: <FaCheck style={{ color: '#28a745' }} />,
        autoClose: 3000,
        position: 'top-right',
      });
    } 
    catch (error) {
      console.error('Order error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to place order', {
        icon: <FaTimes style={{ color: '#dc3545' }} />,
        autoClose: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
      setShowPaymentForm(false);
    }
  };

  const handlePaymentSubmit = () => {
    if (!validatePaymentDetails()) return;
    submitOrder();
  };

  return (
    <div className="place-order-container">
      <h1>Place Your Order Now!</h1>
      
      <div className="order-layout">
        {/* Products Section */}
        <div className="products-section">
          <h2>Available Products</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">Rs. {product.price.toFixed(2)}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <h2>Your Cart ({cart.length})</h2>
          
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Rs. {item.unitPrice.toFixed(2)} × {item.quantity} = Rs. {item.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="item-actions">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product, parseInt(e.target.value))}
                      />
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Items:</span>
                  <span>Rs. {itemsPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>Rs. {deliveryPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="delivery-address">
                <h3>Delivery Address</h3>
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="payment-method">
                <h3>Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Wallet">Mobile Wallet</option>
                  <option value="UPI">UPI Payment</option>
                </select>
              </div>

              <button 
                onClick={placeOrder}
                disabled={loading}
                className="place-order-btn"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentForm && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h2>
              {paymentMethod === 'Card' ? <FaCreditCard /> : 
               paymentMethod === 'Wallet' ? <FaWallet /> : null}
              {paymentMethod} Details
            </h2>
            
            {paymentMethod === 'Card' && (
              <>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentDetailsChange}
                    maxLength="16"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={handlePaymentDetailsChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentDetailsChange}
                      maxLength="3"
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'Wallet' && (
              <div className="form-group">
                <label>Wallet Number</label>
                <input
                  type="text"
                  name="walletNumber"
                  placeholder="Enter your wallet number"
                  value={paymentDetails.walletNumber}
                  onChange={handlePaymentDetailsChange}
                />
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="yourname@upi"
                  value={paymentDetails.upiId}
                  onChange={handlePaymentDetailsChange}
                />
              </div>
            )}

            <div className="modal-buttons">
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentSubmit}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;