"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    next();
};
const validateUser = [
    (0, express_validator_1.body)("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters")
        .trim(),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email").trim(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
router.get("/users", isAuthenticated, userController_1.getUsers);
router.post("/users", isAuthenticated, validateUser, userController_1.createUser);
exports.default = router;
