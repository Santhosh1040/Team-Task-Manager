const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get Projects
router.get(
  "/",
  authMiddleware,
  getProjects
);

// Create Project - ADMIN only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProject
);

// Update Project - ADMIN only
router.put(
  "/:projectId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProject
);

// Delete Project - ADMIN only
router.delete(
  "/:projectId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProject
);

module.exports = router;