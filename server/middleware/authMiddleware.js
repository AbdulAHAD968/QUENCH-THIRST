const User = require("../models/user");

// Bypasses all authentication
const protect = async (req, res, next) => {
  req.user = { 
    _id: "65d8f5b1d4e8a1b9c9a3b3b1",
    name: "Dev User",
    role: "admin"
  };
  next();
};

const admin = (req, res, next) => next();
const employee = (req, res, next) => next();

module.exports = { protect, admin, employee };