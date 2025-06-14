import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status: number = err.status || 500;
  const message: string = err.message || "Server Error";
  res.status(status).json({
    error: message,
    ...(err.errors && { errors: err.errors }),
  });
};