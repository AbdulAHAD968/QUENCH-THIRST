const express = require("express");
const router = express.Router();
const { 
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder 
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route("/myorders").get(protect, getUserOrders);

router.route("/:id")
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus)
  .delete(protect, admin, deleteOrder);

module.exports = router;