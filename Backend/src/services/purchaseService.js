import Purchase from '../models/purchaseModel.js';

/**
 * Get all purchases for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of purchase documents
 */
export const getUserPurchases = async (userId) => {
  return Purchase.find({ user: userId })
    .populate('vehicle')
    .sort({ purchaseDate: -1 });
};

/**
 * Get all purchases across the platform (Admin only)
 * @returns {Promise<Array>} Array of purchase documents
 */
export const getAllPurchases = async () => {
  return Purchase.find({})
    .populate('user', 'email role')
    .populate('vehicle')
    .sort({ purchaseDate: -1 });
};
