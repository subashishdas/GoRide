import captainModel from "../models/Captain.js";

export const createCaptain = async ({
  firstName,
  lastName,
  email,
  password,
  vehicleType,
  vehicleModel,
  vehicleCapacity,
  vehicleColor,
  vehicleNumberPlate,
}) => {
  if (
    !firstName ||
    !email ||
    !password ||
    !vehicleType ||
    !vehicleModel ||
    !vehicleCapacity ||
    !vehicleColor ||
    !vehicleNumberPlate
  ) {
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password,
    vehicle: {
      color: vehicleColor,
      numberPlate: vehicleNumberPlate,
      vehicleCapacity,
      vehicleType,
      vehicleModel,
    },
    
  });
  return captain;
};
