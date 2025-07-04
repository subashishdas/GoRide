import express from "express";
import { body } from "express-validator";
import {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
} from "../controllers/captainController.js";
import { authCaptain } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a captain
router.post(
  "/register",
  [
    // These match your controller's nested structure expectations
    body("fullName.firstName").notEmpty().withMessage("First name is required"),
    body("fullName.lastName").optional(),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.numberPlate")
      .notEmpty()
      .withMessage("Number plate is required"),
    body("vehicle.vehicleCapacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "bike", "auto"])
      .withMessage("Vehicle type must be car, bike, or auto"),
    body("vehicle.vehicleModel")
      .notEmpty()
      .withMessage("Vehicle model is required"),
  ],
  registerCaptain
);

// Login a captain
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginCaptain
);

// Get captain profile
router.get("/profile", authCaptain, getCaptainProfile);

// Logout a captain
router.get("/logout", authCaptain, logoutCaptain);

export default router;
