import captainModel from "../models/Captain.js";
import { createCaptain } from "../services/captainService.js";
import { validationResult } from "express-validator";

export const registerCaptain = async (req, res) => {
  // Validate the request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 error if there are any validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName: { firstName, lastName },
    email,
    password,
    vehicle: {
      vehicleType,
      vehicleModel,
      vehicleCapacity,
      color: vehicleColor,
      numberPlate: vehicleNumberPlate,
    },
  } = req.body;

  try {
    // Check if a captain with the same email already exists
    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
      // Return a 400 error if the captain already exists
      return res.status(400).json({ message: "Captain already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await captainModel.hashPassword(password);

    // Create a new captain with the provided data and hashed password
    const captain = await createCaptain({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      vehicleType,
      vehicleModel,
      vehicleCapacity,
      vehicleColor,
      vehicleNumberPlate,
    });

    // Generate a JWT token for the captain
    const token = captain.generateToken();

    // Return a 201 success response with the created captain and JWT token
    res.status(201).json({
      message: "Captain registered successfully",
      captain,
      token,
    });
  } catch (error) {
    // Return a 500 error if there is an error during registration
    res.status(500).json({ message: error.message });
  }
};

export const loginCaptain = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await captain.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateToken();

    res.status(200).json({
      message: "Login successful",
      captain,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCaptainProfile = async (req, res) => {
  const { captain } = req;

  res.status(200).json({
    message: "Captain profile fetched successfully",
    captain,
  });
};

export const logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  try {
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log out" });
  }
};
