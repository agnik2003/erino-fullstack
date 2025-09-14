const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Signup
router.post("/signup", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Current User
router.get("/me", protect, getMe);

module.exports = router;
