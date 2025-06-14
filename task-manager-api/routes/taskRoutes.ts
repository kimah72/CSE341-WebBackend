import express, { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router: Router = express.Router();

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
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
  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];

router.get("/tasks", isAuthenticated, getTasks);
router.get("/tasks/:id", isAuthenticated, getTaskById);
router.post("/tasks", isAuthenticated, validateTask, createTask);
router.put("/tasks/:id", isAuthenticated, validateTask, updateTask);
router.delete("/tasks/:id", isAuthenticated, deleteTask);

export default router;