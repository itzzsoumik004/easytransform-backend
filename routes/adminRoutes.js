const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getDashboard,
  getAllUsers,
  deleteUser,
  getProfile,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

// =======================
// Public Route
// =======================

// Admin Login
router.post("/login", loginAdmin);

// =======================
// Protected Routes
// =======================

// Dashboard Statistics
router.get(
  "/dashboard",
  adminAuth,
  getDashboard
);

// Admin Profile
router.get(
  "/profile",
  adminAuth,
  getProfile
);

// All Users
router.get(
  "/users",
  adminAuth,
  getAllUsers
);

// Delete User
router.delete(
  "/users/:id",
  adminAuth,
  deleteUser
);

module.exports = router;