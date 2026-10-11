import express from 'express';
import {
  setCareerGoal,
  getCareerGoal
} from '../controllers/careerGoalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protect all career goal routes
router.use(protect);

// PUT /api/career-goal - Set or update authenticated user's target role
router.put('/', setCareerGoal);

// GET /api/career-goal - Return authenticated user's career goal
router.get('/', getCareerGoal);

export default router;
