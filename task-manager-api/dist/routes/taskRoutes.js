"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    next();
};
const validateTask = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required").trim(),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("userId").isMongoId().withMessage("Invalid user ID"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("dueDate").optional().isISO8601().withMessage("Invalid date format"),
];
router.get("/tasks", isAuthenticated, taskController_1.getTasks);
router.get("/tasks/:id", isAuthenticated, taskController_1.getTaskById);
router.post("/tasks", isAuthenticated, validateTask, taskController_1.createTask);
router.put("/tasks/:id", isAuthenticated, validateTask, taskController_1.updateTask);
router.delete("/tasks/:id", isAuthenticated, taskController_1.deleteTask);
exports.default = router;
