const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/profile")
  .get(protect, getProfile) // View profile
  .put(protect, updateProfile); // Update profile

module.exports = router;
