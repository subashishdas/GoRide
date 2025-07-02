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
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract user details from request body
  const { fullName: { firstName, lastName }, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user in the database
    const user = await createUser(firstName, lastName, email, password);

    // Generate JWT token for the user
    const token = user.generateToken();

    // Return success response with user data and token
    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    // Handle any errors during the registration process
    next(error);
  }
};

/**
 * Authenticates a user and returns a JWT token if successful.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateToken();
    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves and returns the profile of the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token");

    // Extract the token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // Blacklist the token to prevent future use
    if (token) {
      await BlacklistToken.create({ token });
    }

    // Send success response
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};
