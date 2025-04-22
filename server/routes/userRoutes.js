const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { protect} = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getAllUsers)
  .post(protect, createUser);

router.route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;