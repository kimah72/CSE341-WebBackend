const User = require("../models/User");
const { validationResult } = require("express-validator");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 422;
    error.errors = errors.array();
    return next(error);
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports = { getUsers, createUser };
