const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude the password field
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      // Check if the user is blocked
      if (user.isBlocked) {
        res.status(403);
        throw new Error('Your account is blocked. Contact support.');
      }

      // Attach user to the request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Error decoding token:', error);
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
