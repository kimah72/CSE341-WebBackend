import express, { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { getUsers, createUser } from "../controllers/userController";

const router: Router = express.Router();

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

router.get("/users", getUsers);
router.post("/users", validateUser, createUser);

export default router;