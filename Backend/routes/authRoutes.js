const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getUsers,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Profile
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

// Admin Route
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

// GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers
);

module.exports = router;