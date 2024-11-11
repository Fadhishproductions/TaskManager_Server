const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  // Create JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour
  });

  return token;
};

module.exports = generateToken;
