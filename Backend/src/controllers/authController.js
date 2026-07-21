import { registerUser, loginUser } from '../services/authService.js';

/**
 * POST /api/auth/register 
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const result = await registerUser({ name, email, password });

    const { token, ...userData } = result;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      data: userData,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const data = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
