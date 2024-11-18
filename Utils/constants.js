// Constants for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error messages
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "All fields are required",
  INVALID_EMAIL: "Please provide a valid email address",
  SHORT_PASSWORD: "Password must be at least 6 characters long",
  EMAIL_TAKEN: "Username or email is already taken",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_IN_USE: "Email already in use",
  TASK_TITLE_REQUIRED: "Title is required",
  INVALID_DUE_DATE: "Invalid due date format",
  TASK_NOT_FOUND: "Task not found",
  UNAUTHORIZED_TASK_ACCESS: "User not authorized to access this task",
  INVALID_TASK_ID: "Invalid task ID",
};

module.exports = { EMAIL_REGEX, ERROR_MESSAGES };
