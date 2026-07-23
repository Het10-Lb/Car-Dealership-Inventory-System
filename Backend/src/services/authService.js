import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<object>} The created user (without password).
 */
export const registerUser = async ({ name, email, password }) => {
  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  // Assign role automatically based on email
  const role = (email.toLowerCase() === 'admin@car.com') ? 'admin' : 'customer';

  const user = await User.create({ name, email, password, role });

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Return user data without password, including generated token
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  return { ...userObj, token };
};

/**
 * Authenticate a user and return a JWT.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token };
};
