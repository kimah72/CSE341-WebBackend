import express, { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { getUsers, createUser } from "../controllers/userController";

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

const validateUser = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .trim(),
  body("email").isEmail().withMessage("Invalid email").trim(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

router.get("/users", isAuthenticated, getUsers);
router.post("/users", isAuthenticated, validateUser, createUser);

export default router;