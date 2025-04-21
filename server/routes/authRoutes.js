const express = require("express");
const { registerUser, loginUser, createAdmin } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (only admins can access)
router.post("/create-admin", protect, admin, createAdmin);

module.exports = router;
