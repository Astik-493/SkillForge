import express from 'express';
import { getRoadmap } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all roadmap routes
router.use(protect);

// GET /api/roadmap - Get personalized learning roadmap and project recommendations
router.get('/', getRoadmap);

export default router;
