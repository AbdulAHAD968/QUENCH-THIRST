const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  getSalesAnalytics
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// Create new order
router.post('/', createOrder);


router.get('/user/myorders', protect, getUserOrders);
router.get('/admin/sales-analytics', protect, admin, getSalesAnalytics);


router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

router.get('/', protect, admin, getAllOrders);

module.exports = router;
