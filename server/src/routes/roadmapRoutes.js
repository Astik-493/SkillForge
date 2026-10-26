import express from 'express';
import {
  getRoadmap,
  getRoadmapProgress,
  updateRoadmapProgress
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all roadmap routes
router.use(protect);

// GET /api/roadmap - Get personalized learning roadmap with milestone progress
router.get('/', getRoadmap);

// GET /api/roadmap/progress - Get persistent roadmap progress for active career role
router.get('/progress', getRoadmapProgress);

// PUT /api/roadmap/progress - Toggle completion status for a learning milestone
router.put('/progress', updateRoadmapProgress);

export default router;
