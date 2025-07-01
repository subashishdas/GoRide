import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/BlacklistToken.js";

/**
 * Verifies the JWT token and authenticates the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const authUser = async (req, res, next) => {
  // Get the token from the cookies or the Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    // If no token is present, return a 401 Unauthorized response
    return res.status(401).json({ message: "Unauthorized" });
  }
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user in the database by their ID
    const user = await User.findById(decoded._id);
    // Set the user on the request object
    req.user = user;
    // Call the next middleware function
    return next();
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized response
    return res.status(401).json({ message: "Unauthorized" });
  }
};
