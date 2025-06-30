import User from "../models/User.js";
import { createUser } from "../services/userService.js";
import { validationResult } from "express-validator";

// Register a new user
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;

  const hashedPassword = await User.hashPassword(password);

  const user = await createUser(firstName, lastName, email, hashedPassword);

  const token = user.generateToken();

  res.status(201).json({
    message: "User created successfully",
    user,
    token,
  });
};
