import CareerGoal from '../models/careerGoal.model.js';
import { SUPPORTED_ROLES } from '../config/roleRequirements.js';

/**
 * Set or update the authenticated user's target career goal
 * PUT /api/career-goal
 */
export const setCareerGoal = async (req, res) => {
  try {
    const { targetRole } = req.body;

    // 1. Validate targetRole presence
    if (!targetRole || typeof targetRole !== 'string' || !targetRole.trim()) {
      return res.status(400).json({
        message: 'Target role is required'
      });
    }

    const trimmedRole = targetRole.trim();

    // 2. Validate targetRole is a supported role
    if (!SUPPORTED_ROLES.includes(trimmedRole)) {
      return res.status(400).json({
        message: 'Unsupported target role',
        supportedRoles: SUPPORTED_ROLES
      });
    }

    // 3. Create or update career goal associated with req.user._id
    const careerGoal = await CareerGoal.findOneAndUpdate(
      { user: req.user._id },
      { $set: { targetRole: trimmedRole, user: req.user._id } },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: 'Career goal saved successfully',
      careerGoal
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: 'Server error while saving career goal',
      error: error.message
    });
  }
};

/**
 * Get the authenticated user's career goal
 * GET /api/career-goal
 */
export const getCareerGoal = async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findOne({ user: req.user._id });

    if (!careerGoal) {
      return res.status(404).json({
        message: 'Career goal not found'
      });
    }

    return res.status(200).json({
      message: 'Career goal fetched successfully',
      careerGoal
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching career goal',
      error: error.message
    });
  }
};

export const updateCareerGoal = setCareerGoal;
