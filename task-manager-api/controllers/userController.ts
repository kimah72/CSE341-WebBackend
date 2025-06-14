import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import User, { IUser } from "../models/User";

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users: IUser[] = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error: any) {
    error.status = 500;
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    (error as any).status = 422;
    (error as any).errors = errors.array();
    next(error);
    return;
  }
  try {
    const user: IUser = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error: any) {
    error.status = 400;
    next(error);
  }
};