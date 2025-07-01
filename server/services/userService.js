import User from "../models/User.js";

/**
 * Creates a new user in the database.
 * @param {string} firstName The first name of the user.
 * @param {string} lastName The last name of the user.
 * @param {string} email The email address of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<User>} The created user.
 */
export const createUser = async (firstName, lastName, email, password) => {
  if (!firstName || !email || !password) {
    // If any of the fields are empty, throw an error.
    throw new Error("All fields are required");
  }
  // Check if a user with the same email exists.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // If a user exists, throw an error.
    throw new Error("User already exists");
  }
  // Hash the user's password.
  const hashedPassword = await User.hashPassword(password);
  // Create the user in the database.
  const user = await User.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });
  // Return the created user.
  return user;
};
