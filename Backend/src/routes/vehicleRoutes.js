import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';
import {
  getAll,
  search,
  create,
  update,
  remove,
  purchase,
  restock,
} from '../controllers/vehicleController.js';

const router = Router();

// All vehicle routes require authentication
router.use(verifyToken);

// Any authenticated user
router.get('/', getAll);
router.get('/search', search);

// Business transaction - Purchase (Any authenticated user)
router.post('/:id/purchase', purchase);

// Admin only
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);

// Business transaction - Restock (Admin only)
router.post('/:id/restock', requireAdmin, restock);

export default router;

