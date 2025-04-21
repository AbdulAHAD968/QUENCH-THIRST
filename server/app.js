const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const deliveryRoutes = require("./routes/deliveryRoutes");
// const subscriptionRoutes = require("./routes/subscriptionRoutes");
//const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/deliveries", deliveryRoutes);
// app.use("/api/subscriptions", subscriptionRoutes);
// app.use("/api/feedback", feedbackRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));