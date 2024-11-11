const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update only the fields provided in the request body
  user.name = req.body.name ?? user.name;

  if (req.body.email && req.body.email !== user.email) {
    // Ensure the new email is unique
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = req.body.email;
  }

  if (req.body.password) {
    // Hash the new password before saving
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters long");
    }
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
    },
  });
});

module.exports = { getProfile, updateProfile };
