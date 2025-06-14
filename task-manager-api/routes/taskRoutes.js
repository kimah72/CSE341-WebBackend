const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

const validateTask = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").optional().trim(),
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
];

router.get("/tasks", isAuthenticated, getTasks);
router.get("/tasks/:id", isAuthenticated, getTaskById);
router.post("/tasks", isAuthenticated, validateTask, createTask);
router.put("/tasks/:id", isAuthenticated, validateTask, updateTask);
router.delete("/tasks/:id", isAuthenticated, deleteTask);

module.exports = router;