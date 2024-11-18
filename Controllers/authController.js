const User = require("../Models/userModel")
const generateToken = require("../Utils/generateToken");
const asyncHandler = require("express-async-handler")
const { EMAIL_REGEX, ERROR_MESSAGES } = require("../Utils/constants");
// User Registration
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  console.log(req.body)
    // Validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
    }
  
    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    }
  
    // Validate password length
    if (password.length < 6) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.SHORT_PASSWORD);
    }
  
    // Check if email or username is already taken
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.EMAIL_TAKEN);
    }
  
    // Register new user
    const newUser = new User({ username, email, password });
    await newUser.save();
  
    // Generate token and set in cookie
   const jwt = generateToken(res, newUser._id);
  
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      jwt
    });
  });
  
  // User Login
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Validate required fields
    if (!email || !password) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.REQUIRED_FIELDS);
    }
  
    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    }
  
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(400);
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
  
    // Generate token and set in cookie
    const jwt = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      jwt,
    });
  });

  const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  });

  
  // const updateProfile = asyncHandler(async (req, res) => {
  //   const user = await User.findById(req.user._id);
  //   if (!user) {
  //     res.status(404);
  //     throw new Error("User not found");
  //   }
  
  //   // Update only the fields provided in the request body
  //   user.name = req.body.name ?? user.name;
  
  //   if (req.body.email && req.body.email !== user.email) {
  //     // Ensure the new email is unique
  //     const emailExists = await User.findOne({ email: req.body.email });
  //     if (emailExists) {
  //       res.status(400);
  //       throw new Error("Email already in use");
  //     }
  //     user.email = req.body.email;
  //   }
  
  //   if (req.body.password) {
  //     // Hash the new password before saving
  //     if (req.body.password.length < 6) {
  //       res.status(400);
  //       throw new Error("Password must be at least 6 characters long");
  //     }
  //     user.password = req.body.password;
  //   }
  
  //   const updatedUser = await user.save();
  //   res.json({
  //     message: "Profile updated successfully",
  //     user: {
  //       id: updatedUser._id,
  //       username: updatedUser.username,
  //       email: updatedUser.email,
  //       name: updatedUser.name,
  //     },
  //   });
  // });

const logoutUser = (req, res) => {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  };
module.exports = { registerUser, loginUser ,logoutUser};
