import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { getMyHistory, getAllPurchases } from '../controllers/purchaseController.js';

const router = Router();

// All purchase routes require authentication
router.use(verifyToken);

// Customer route
router.get('/my-history', getMyHistory);

// Admin route
router.get('/', requireAdmin, getAllPurchases);

export default router;
