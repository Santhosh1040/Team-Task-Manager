const express = require("express");

const router = express.Router();

const {
  createTask,
  assignTask,
  updateTask,
  updateTaskStatus,
  getTasks,
  getMyTasks,
  deleteTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Tasks
router.get(
  "/",
  authMiddleware,
  getTasks
);

// Get My Tasks
router.get(
  "/my-tasks",
  authMiddleware,
  getMyTasks
);

// Create Task - ADMIN only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTask
);

// Update Task - ADMIN only
router.put(
  "/:taskId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateTask
);

// Assign Task - ADMIN only
router.put(
  "/:taskId/assign",
  authMiddleware,
  roleMiddleware("ADMIN"),
  assignTask
);

// Update Task Status
// ADMIN -> can update all tasks
// MEMBER -> can update only assigned tasks
router.put(
  "/:taskId/status",
  authMiddleware,
  updateTaskStatus
);

// Delete Task - ADMIN only
router.delete(
  "/:taskId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteTask
);

module.exports = router;

