const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../Controllers/authController");
const { protect } = require("../Middlewares/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",protect, logoutUser);
module.exports = router;