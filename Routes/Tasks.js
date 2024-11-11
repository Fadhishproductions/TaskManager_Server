const express = require("express");
const { getTasks, createTask, updateTask, deleteTask, getTaskStatistics, markTaskCompleted } = require("../Controllers/TaskController");
const { protect } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getTasks)
  .post(protect, createTask);

router.route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.patch('/:id/complete',protect,markTaskCompleted)
// Route for task statistics
router.get("/stats", protect, getTaskStatistics);

module.exports = router;
