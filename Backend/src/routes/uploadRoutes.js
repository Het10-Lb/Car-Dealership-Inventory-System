import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();

// Upload route is Admin only
router.post('/', verifyToken, requireAdmin, uploadImage);

export default router;
