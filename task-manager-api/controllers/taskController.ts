import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Task, { ITask } from "../models/Task";

// Extend Express Request interface to include user with _id
declare global {
  namespace Express {
    interface User {
      _id: string;
      // add other user properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks: ITask[] = await Task.find({ userId: req.user?._id });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task: ITask | null = await Task.findOne({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const task: ITask = new Task({ ...req.body, userId: req.user?._id });
    await task.save();
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    const task: ITask | null = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task: ITask | null = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id,
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};