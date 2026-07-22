import { getUserPurchases, getAllPurchases as fetchAllPurchases } from '../services/purchaseService.js';

export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await getUserPurchases(userId);
    return res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await fetchAllPurchases();
    return res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};
