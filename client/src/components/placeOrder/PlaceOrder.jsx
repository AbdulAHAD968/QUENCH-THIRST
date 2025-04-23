import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
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
  const deliveryPrice = itemsPrice > 1000 ? 0 : 100; // Free delivery for orders over 1000
  const totalPrice = itemsPrice + deliveryPrice;

  // Handle address change
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  // Place order function
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.postalCode) {
      alert('Please fill in all address fields');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      };

      const orderData = {
        orderItems: cart,
        deliveryAddress: address,
        paymentMethod,
        itemsPrice,
        deliveryPrice,
        totalPrice
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="place-order-container">
      <h1>Place Your Water Order</h1>
      
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
                  <option value="cash">Cash on Delivery</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="mobile_payment">Mobile Payment</option>
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
    </div>
  );
};

export default PlaceOrder;