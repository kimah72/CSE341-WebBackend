"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const getUsers = async (_req, res, next) => {
    try {
        const users = await User_1.default.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        error.status = 500;
        next(error);
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 422;
        error.errors = errors.array();
        next(error);
        return;
    }
    try {
        const user = new User_1.default(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        error.status = 400;
        next(error);
    }
};
exports.createUser = createUser;
