// models/EmployeeShipping.js
const mongoose = require('mongoose');

const EmployeeShippingSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shippingDate: {
    type: Date,
    default: Date.now
  },
  deliveryTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['In Transit', 'Delivered', 'Returned'],
    default: 'Delivered'
  },
  customerRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeShipping', EmployeeShippingSchema);