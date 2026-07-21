import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { getAll, search, create, update, remove } from '../controllers/vehicleController.js';

const router = Router();

// All vehicle routes require authentication
router.use(verifyToken);

// Any authenticated user
router.get('/', getAll);
router.get('/search', search);

// Admin only
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);

export default router;
