const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/user');


const createOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    orderItems,
    deliveryAddress,
    paymentMethod = 'COD', // Default to COD if not provided
    itemsPrice,
    deliveryPrice,
    totalPrice
  } = req.body;

  // Validate required fields
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  // Validate each order item
  const validatedItems = orderItems.map(item => {
    if (!item._id || !item.price || !item.quantity || !item.name) {
      res.status(400);
      throw new Error('Each item must include _id, name, price and quantity');
    }
    return {
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    };
  });

  // Validate payment method
  const validPaymentMethods = ['COD', 'Card', 'UPI', 'Wallet'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    res.status(400);
    throw new Error(`Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`);
  }

  const order = new Order({
    user: userId,
    orderItems: validatedItems,
    deliveryAddress,
    paymentMethod,
    itemsPrice,
    deliveryPrice,
    totalPrice
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  // Verify authentication
  if (!req.user?._id) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }

  // Verify the user exists
  const userExists = await User.findById(req.user._id);
  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get orders with proper population
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate({
      path: 'orderItems.product',
      select: 'name price image'
    });

  res.status(200).json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: 1 })
      .lean();
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;

    res.json({
      orders,
      totalSales,
      totalOrders,
      averageOrderValue: totalSales / totalOrders
    });
  } catch (error) {
    console.error('Error in sales analytics:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  getSalesAnalytics,
};