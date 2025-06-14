"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
var Task_1 = require("./models/Task");
var expressValidator = require("express-validator");
var validationResult = expressValidator.validationResult;
var getTasks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, error_1, customError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Task_1.default.find({})];
            case 1:
                tasks = _a.sent();
                res.json(tasks);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                customError = error_1;
                customError.status = 500;
                next(customError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTasks = getTasks;
var getTaskById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var task, error, error_2, customError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Task_1.default.findOne({ _id: req.params.id })];
            case 1:
                task = _a.sent();
                if (!task) {
                    error = new Error("Task not found");
                    error.status = 404;
                    throw error;
                }
                res.json(task);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                customError = error_2;
                customError.status = customError.status || 500;
                next(customError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTaskById = getTaskById;
var createTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, error, task, error_3, customError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = validationResult(req);
                if (!errors.isEmpty()) {
                    error = new Error("Validation failed");
                    error.status = 422;
                    error.errors = errors.array();
                    throw error;
                }
                task = new Task_1.default(__assign(__assign({}, req.body), { userId: "temp_user_id" }));
                return [4 /*yield*/, task.save()];
            case 1:
                _a.sent();
                res.status(201).json(task);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                customError = error_3;
                customError.status = error_3.status || 500;
                next(customError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createTask = createTask;
var updateTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, error, task, error, error_4, customError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errors = validationResult(req);
                if (!errors.isEmpty()) {
                    error = new Error("Validation failed");
                    error.status = 422;
                    error.errors = errors.array();
                    throw error;
                }
                return [4 /*yield*/, Task_1.default.findOneAndUpdate({ _id: req.params.id }, __assign(__assign({}, req.body), { updatedAt: new Date() }), { new: true })];
            case 1:
                task = _a.sent();
                if (!task) {
                    error = new Error("Task not found");
                    error.status = 404;
                    throw error;
                }
                res.json(task);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                customError = error_4;
                customError.status = error_4.status || 500;
                next(customError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateTask = updateTask;
var deleteTask = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var task, error, error_5, customError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Task_1.default.findOneAndDelete({ _id: req.params.id })];
            case 1:
                task = _a.sent();
                if (!task) {
                    error = new Error("Task not found");
                    error.status = 404;
                    throw error;
                }
                res.json({ message: "Task deleted" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                customError = error_5;
                customError.status = error_5.status || 500;
                next(customError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteTask = deleteTask;
