const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = decoded; // Add user payload to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };