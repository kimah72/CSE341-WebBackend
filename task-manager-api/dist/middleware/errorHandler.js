"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Server Error";
    res.status(status).json({
        error: message,
        ...(err.errors && { errors: err.errors }),
    });
};
exports.errorHandler = errorHandler;
