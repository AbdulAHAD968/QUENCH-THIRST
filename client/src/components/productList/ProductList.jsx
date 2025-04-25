import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaTimes , FaCheck, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './ProductList.css';
import { toast } from 'react-toastify';

const ProductManager = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'bottled_water',
    price: 0,
    stockQuantity: 0,
    imageUrl: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error(`Error fetching products: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setProducts(products.filter(product => product._id !== productId));
        toast.success('Product deleted successfully!', {
          icon: <FaCheck style={{ color: '#28a745' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message, {
          icon: <FaTimes style={{ color: '#dc3545' }} />,
          autoClose: 4000,
          position: 'top-right',
        });
      }
    }
  };
  
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
      if (formMode === 'edit') {
        await axios.put(
          `http://localhost:5000/api/products/${currentProductId}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        setProducts(products.map(product => 
          product._id === currentProductId ? { ...product, ...formData } : product
        ));
        toast.success('Product updated successfully!', {
          icon: <FaCheck style={{ color: '#28a745' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
      } else {
        const { data } = await axios.post(
          'http://localhost:5000/api/products',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        setProducts([...products, data.product]);
        toast.success('Product added successfully!', {
          icon: <FaCheck style={{ color: '#28a745' }} />,
          autoClose: 3000,
          position: 'top-right',
        });
      }
      closeForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: <FaTimes style={{ color: '#dc3545' }} />,
        autoClose: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (product) => {
    setFormMode('edit');
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl
    });
  };

  const openAddForm = () => {
    setFormMode('add');
    setCurrentProductId(null);
    setFormData({
      name: '',
      description: '',
      category: 'bottled_water',
      price: 0,
      stockQuantity: 0,
      imageUrl: ''
    });
  };

  const closeForm = () => {
    setFormMode(null);
    setCurrentProductId(null);
    setError('');
  };

  if (loading && !formMode) return <div className="loading">Loading...</div>;
  if (error && !formMode) return <div className="error">{error}</div>;

  return (
    <div className="product-manager">
      <div className="product-list">
        <div className="product-list-header">
          <h2>Available Water Products</h2>
          {isAdmin && (
            <button 
              onClick={openAddForm}
              className="btn-add"
            >
              <FaPlus /> Add Product
            </button>
          )}
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            product ? (
              <div key={product._id || index} className="product-card">
                <div className="product-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">Rs. {product.price.toFixed(2)}</p>
                  <p className="stock">
                    {product.stockQuantity > 0 
                      ? `In Stock: ${product.stockQuantity}` 
                      : 'Out of Stock'}
                  </p>
                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        onClick={() => openEditForm(product)}
                        className="btn-edit"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="btn-delete"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Modal Form for Add/Edit */}
      {formMode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="product-form-container">
              <h2>{formMode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
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
                    onClick={closeForm}
                    className="cancel-btn"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;