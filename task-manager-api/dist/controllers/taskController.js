"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const express_validator_1 = require("express-validator");
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = async (req, res) => {
    var _a;
    try {
        const tasks = await Task_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    var _a;
    try {
        const task = await Task_1.default.findOne({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const task = new Task_1.default({ ...req.body, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        await task.save();
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const task = await Task_1.default.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { ...req.body, updatedAt: new Date() }, { new: true });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    var _a;
    try {
        const task = await Task_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteTask = deleteTask;
