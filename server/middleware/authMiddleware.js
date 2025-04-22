// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/user");

// // const protect = asyncHandler(async (req, res, next) => {
// //   let token;

// //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
// //     try {
// //       // Get token from header
// //       token = req.headers.authorization.split(" ")[1];

// //       // Verify token
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //       // Get user from the token
// //       req.user = await User.findById(decoded.id).select("-password");

// //       next();
// //     } catch (error) {
// //       console.log(error);
// //       res.status(401);
// //       throw new Error("Not authorized");
// //     }
// //   }

// //   if (!token) {
// //     res.status(401);
// //     throw new Error("Not authorized, no token");
// //   }
// // });


// const protect = asyncHandler(async (req, res, next) => {
//   if (process.env.NODE_ENV === "development") {
//     req.user = { id: "dummyid", role: "admin" }; // or "employee" or "user"
//     return next();
//   }

//   let token;
//   if (!req.headers.authorization?.startsWith("Bearer")) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }

//   try {
//     token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     res.status(401);
//     throw new Error("Not authorized, invalid token");
//   }
// });


// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(401);
//     throw new Error("Not authorized as an admin");
//   }
// };

// const employee = (req, res, next) => {
//   if (req.user && (req.user.role === "admin" || req.user.role === "employee")) {
//     next();
//   } else {
//     res.status(401);
//     throw new Error("Not authorized as an employee");
//   }
// };

// module.exports = { protect, admin, employee };


const User = require("../models/user");

// Bypasses all authentication
const protect = async (req, res, next) => {
  // Attach a dummy admin user to every request
  req.user = { 
    _id: "65d8f5b1d4e8a1b9c9a3b3b1", // Random fake ID
    name: "Dev User",
    role: "admin" // Grant admin privileges by default
  };
  next();
};

// No actual role checking
const admin = (req, res, next) => next();
const employee = (req, res, next) => next();

module.exports = { protect, admin, employee };