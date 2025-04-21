// utils/validators.js
exports.validateProductInput = (data) => {
    const errors = {};
    let valid = true;
  
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Product name is required';
      valid = false;
    }
  
    if (!data.description || data.description.trim() === '') {
      errors.description = 'Product description is required';
      valid = false;
    }
  
    if (!data.price || isNaN(data.price) || data.price <= 0) {
      errors.price = 'Valid price is required';
      valid = false;
    }
  
    if (!data.stockQuantity || isNaN(data.stockQuantity) || data.stockQuantity < 0) {
      errors.stockQuantity = 'Valid stock quantity is required';
      valid = false;
    }
  
    if (!data.category || !['bottled_water', 'dispensers', 'accessories'].includes(data.category)) {
      errors.category = 'Valid category is required';
      valid = false;
    }
  
    return { errors, valid };
};