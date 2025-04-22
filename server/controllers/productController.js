// controllers/productController.js
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { validateProductInput } = require('../utils/validators');

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword ? {
    $or: [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } }
    ]
  } : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { errors, valid } = validateProductInput(req.body);
  
  if (!valid) {
    res.status(400);
    throw new Error(Object.values(errors).join(' '));
  }

  const product = new Product({
    user: req.user._id,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    stockQuantity: req.body.stockQuantity,
    imageUrl: req.body.imageUrl || ''
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { errors, valid } = validateProductInput(req.body);
  
  if (!valid) {
    res.status(400);
    throw new Error(Object.values(errors).join(' '));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update product fields
  product.name = req.body.name;
  product.description = req.body.description;
  product.category = req.body.category;
  product.price = req.body.price;
  product.stockQuantity = req.body.stockQuantity;
  product.imageUrl = req.body.imageUrl || product.imageUrl;
  product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed successfully' });
});


const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ price: -1 }).limit(4);
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts
};