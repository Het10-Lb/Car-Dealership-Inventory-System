import { Router } from 'express';
import { register, login, updateProfile, updatePassword } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);

export default router;
