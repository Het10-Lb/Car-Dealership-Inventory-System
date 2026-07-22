import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Upload route is Admin only
router.post('/', verifyToken, requireAdmin, upload.single('image'), uploadImage);

export default router;
