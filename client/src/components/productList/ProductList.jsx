import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = ({ isAdmin }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Available Water Products</h2>
        {isAdmin && (
          <Link to="/add-product" className="btn-add">
            Add Product
          </Link>
        )}
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
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
                  <Link 
                    to={`/edit-product/${product._id}`}
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;