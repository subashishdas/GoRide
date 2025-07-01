import User from "../models/User.js";
import { createUser } from "../services/userService.js";
import { validationResult } from "express-validator";
import BlacklistToken from "../models/BlacklistToken.js";
/**
 * Registers a new user in the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract the user details from the request body
  const { fullName, email, password } = req.body;
  const { firstName, lastName } = fullName;

  // Create the user in the database
  const user = await createUser(firstName, lastName, email, password);

  // Generate a JWT token for the user
  const token = user.generateToken();

  // Return the user and the token in the response
  res.status(201).json({
    message: "User created successfully",
    user,
    token,
  });
};

/**
 * Authenticates a user and returns a JWT token if successful.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const loginUser = async (req, res, next) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Find user by email and include password in the selection
    const user = await User.findOne({ email }).select("+password");

    // If user is not found, return unauthorized error
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate a JWT token for the authenticated user
    const token = user.generateToken();
    res.cookie("token", token);
    // Send success response with user data and token
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    // Handle any errors during the login process
    next(error);
  }
};

/**
 * Returns the user profile of the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const getUserProfile = async (req, res, next) => {
  // Return the user profile of the authenticated user
  res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};

export const logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  await BlacklistToken.create({ token });
  res.status(200).json({
    message: "Logged out successfully",
  });
};
