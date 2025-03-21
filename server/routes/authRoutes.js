const express = require("express");
const { registerUser, loginUser, createAdmin } = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (only admins can access)
router.post("/create-admin", authMiddleware, isAdmin, createAdmin);

module.exports = router;