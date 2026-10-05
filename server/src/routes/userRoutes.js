import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/profile (Protected)
router.get('/profile', protect, getProfile);

export default router;
