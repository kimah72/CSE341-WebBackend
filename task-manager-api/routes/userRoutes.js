const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { getUsers, createUser } = require("../controllers/userController");

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

module.exports = router;
