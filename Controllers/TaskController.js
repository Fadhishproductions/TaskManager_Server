const Task = require("../Models/taskModel");
const asyncHandler = require("express-async-handler");
const { ERROR_MESSAGES } = require("../Utils/constants");
const { getIO } = require("../Utils/socketServer");

// Get all tasks for a user
const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let filter = { userId: req.user._id };

  if (status === "completed") {
    filter.completed = true;
  } else if (status === "pending") {
    filter.completed = false;
  }

  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    console.error("Error while retrieving tasks:", error);
    throw new Error("Failed to retrieve tasks");
  }
});

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { title, description, completed, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.TASK_TITLE_REQUIRED);
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.INVALID_DUE_DATE);
  }

  const task = new Task({
    title,
    description,
    completed: completed || false,
    dueDate: dueDate ? new Date(dueDate) : null,
    userId: req.user._id,
  });

  await task.save();
  const io = getIO();
  io.to(req.user._id.toString()).emit("taskCreated", task);

  res.status(201).json(task);
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, dueDate } = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.INVALID_TASK_ID);
  }

  const task = await Task.findOne({ _id: id, userId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
  }

  if (title !== undefined && title.trim() === "") {
    res.status(400);
    throw new Error(ERROR_MESSAGES.TASK_TITLE_REQUIRED);
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.INVALID_DUE_DATE);
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.completed = completed ?? task.completed;
  task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;

  await task.save();
  const io = getIO();
  io.to(req.user._id.toString()).emit("taskUpdated", task);

  res.json(task);
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error(ERROR_MESSAGES.INVALID_TASK_ID);
  }

  const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
  }

  const io = getIO();
  io.to(req.user._id.toString()).emit("taskDeleted", id);

  res.json({ message: "Task deleted" });
});

// Mark a task as completed
const markTaskCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
  }

  if (task.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED_TASK_ACCESS);
  }

  task.completed = true;
  await task.save();
  const io = getIO();
  io.to(req.user._id.toString()).emit("taskCompleted", task);

  res.status(200).json({ message: "Task marked as completed", task });
});

  const getTaskStatistics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    // Get total number of tasks
    const totalTasks = await Task.countDocuments({ userId });
  
    // Get number of completed tasks
    const completedTasks = await Task.countDocuments({ userId, completed: true });
  
    // Get number of pending tasks
    const pendingTasks = await Task.countDocuments({ userId, completed: false });
  
    // Optionally, get tasks by due date (e.g., tasks due today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksDueToday = await Task.countDocuments({
      userId,
      dueDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });
  
    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      tasksDueToday,
    });
  });
  
module.exports = { getTasks, createTask, updateTask, deleteTask , getTaskStatistics ,markTaskCompleted };
