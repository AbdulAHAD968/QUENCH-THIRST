const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require('./routes/feedbackRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 5000;


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', orderRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));