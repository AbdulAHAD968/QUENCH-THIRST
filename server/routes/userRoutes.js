const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserProfile,
} = require("../controllers/userController");


router.route("/profile/:id")
  .put(updateUserProfile)  // Update profile
  .get(getUserById);

// Existing admin routes
router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;