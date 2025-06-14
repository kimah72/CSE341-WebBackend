"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expressValidator = __importStar(require("express-validator"));
const taskController_1 = require("../controllers/taskController");
const { body, validationResult } = expressValidator;
const router = express_1.default.Router();
const isAuthenticated = (req, res, next) => {
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
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get("/tasks", isAuthenticated, asyncHandler(taskController_1.getTasks));
router.get("/tasks/:id", isAuthenticated, asyncHandler(taskController_1.getTaskById));
router.post("/tasks", isAuthenticated, validateTask, asyncHandler(taskController_1.createTask));
router.put("/tasks/:id", isAuthenticated, validateTask, asyncHandler(taskController_1.updateTask));
router.delete("/tasks/:id", isAuthenticated, asyncHandler(taskController_1.deleteTask));
exports.default = router;
