import express from 'express';
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  getSkillGaps
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all skill routes
router.use(protect);

// GET /api/skills/gaps - Get skill gaps based on career goal
router.get('/gaps', getSkillGaps);

// POST /api/skills - Add skill
router.post('/', addSkill);

// GET /api/skills - Get all skills for current user
router.get('/', getSkills);

// PATCH /api/skills/:id - Update skill
router.patch('/:id', updateSkill);

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', deleteSkill);

export default router;
