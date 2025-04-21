// backend/seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' }); // Specify the path to your .env file

// Verify MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const sampleProducts = [
  {
    name: "Mineral Water 1L",
    description: "Pure mineral water in 1 liter bottle",
    category: "bottled_water",
    price: 50,
    stockQuantity: 100,
    imageUrl: "https://example.com/water1.jpg"
  },
  {
    name: "Mineral Water 5L",
    description: "Premium mineral water in 5 liter bottle",
    category: "bottled_water",
    price: 200,
    stockQuantity: 50,
    imageUrl: "https://example.com/water5.jpg"
  },
  {
    name: "Water Dispenser Standard",
    description: "Standard water dispenser with hot and cold options",
    category: "dispensers",
    price: 5000,
    stockQuantity: 10,
    imageUrl: "https://example.com/dispenser1.jpg"
  },
  {
    name: "Water Purifier",
    description: "Advanced water purification system",
    category: "accessories",
    price: 8000,
    stockQuantity: 5,
    imageUrl: "https://example.com/purifier1.jpg"
  },
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
    
    console.log('Clearing existing products...');
    await Product.deleteMany();
    console.log('Existing products cleared');
    
    console.log('Adding sample products...');
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products added successfully`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();