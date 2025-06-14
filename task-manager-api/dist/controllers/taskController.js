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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const expressValidator = __importStar(require("express-validator"));
const { validationResult } = expressValidator;
const getTasks = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User not authenticated");
        }
        const tasks = await Task_1.default.find({ userId: req.user._id });
        res.json(tasks);
    }
    catch (error) {
        const customError = error;
        customError.status = 500;
        next(customError);
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User not authenticated");
        }
        const task = await Task_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        res.json(task);
    }
    catch (error) {
        const customError = error;
        customError.status = customError.status || 500;
        next(customError);
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.status = 422;
            error.errors = errors.array();
            throw error;
        }
        if (!req.user) {
            throw new Error("User not authenticated");
        }
        const task = new Task_1.default({ ...req.body, userId: req.user._id });
        await task.save();
        res.status(201).json(task);
    }
    catch (error) {
        const customError = error;
        customError.status = error.status || 500;
        next(customError);
    }
};
exports.createTask = createTask;
const updateTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.status = 422;
            error.errors = errors.array();
            throw error;
        }
        if (!req.user) {
            throw new Error("User not authenticated");
        }
        const task = await Task_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { ...req.body, updatedAt: new Date() }, { new: true });
        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        res.json(task);
    }
    catch (error) {
        const customError = error;
        customError.status = error.status || 500;
        next(customError);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User not authenticated");
        }
        const task = await Task_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        res.json({ message: "Task deleted" });
    }
    catch (error) {
        const customError = error;
        customError.status = error.status || 500;
        next(customError);
    }
};
exports.deleteTask = deleteTask;
