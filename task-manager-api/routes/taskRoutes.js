const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const validateTask = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be YYYY-MM-DD"),
];

router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", validateTask, createTask);
router.put("/tasks/:id", validateTask, updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
