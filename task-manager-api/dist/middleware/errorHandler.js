"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Server Error";
    res.status(status).json({
        error: message,
        ...(err.errors && { errors: err.errors }),
    });
};
exports.default = errorHandler;
