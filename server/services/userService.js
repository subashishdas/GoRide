import User from "../models/User.js";

export const createUser = async (firstName, lastName, email, password) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });
  return user;
};
