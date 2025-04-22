// components/productList/ProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';
import './ProductForm.css';

const ProductForm = ({ editMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'bottled_water',
    price: 0,
    stockQuantity: 0,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            stockQuantity: data.stockQuantity,
            imageUrl: data.imageUrl
          });
        } catch (err) {
          setError(err.response?.data?.message || err.message);
        }
      };
      fetchProduct();
    }
  }, [editMode, id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editMode) {
        await axios.put(
          `/api/products/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
      } else {
        await axios.post(
          '/api/products',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
      }
      navigate('/admin-dashboard/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="bottled_water">Bottled Water</option>
            <option value="dispensers">Dispensers</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (Rs.)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            <FaSave /> {loading ? 'Processing...' : 'Save'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/admin-dashboard/products')}
            className="cancel-btn"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;