import mongoose from 'mongoose';
import Skill from '../models/skill.model.js';
import CareerGoal from '../models/careerGoal.model.js';
import { ROLE_REQUIREMENTS } from '../config/roleRequirements.js';

// Helper to safely escape user input for regular expressions
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Add a new skill for the authenticated user
 * POST /api/skills
 */
export const addSkill = async (req, res) => {
  try {
    const { name, proficiency } = req.body;

    // 1. Validate name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        message: 'Skill name is required'
      });
    }

    // 2. Validate proficiency (integer between 1 and 5)
    if (
      proficiency === undefined ||
      proficiency === null ||
      typeof proficiency !== 'number' ||
      !Number.isInteger(proficiency) ||
      proficiency < 1 ||
      proficiency > 5
    ) {
      return res.status(400).json({
        message: 'Proficiency must be an integer between 1 and 5'
      });
    }

    const trimmedName = name.trim();

    // 3. Check for existing duplicate skill for this user (safely escaped)
    const existingSkill = await Skill.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') }
    });

    if (existingSkill) {
      return res.status(409).json({
        message: 'Skill already exists for this user'
      });
    }

    // 4. Create and save new skill
    const newSkill = await Skill.create({
      user: req.user._id,
      name: trimmedName,
      proficiency
    });

    return res.status(201).json({
      message: 'Skill added successfully',
      skill: newSkill
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Skill already exists for this user'
      });
    }

    return res.status(500).json({
      message: 'Server error while adding skill',
      error: error.message
    });
  }
};

/**
 * Add or update multiple skills in batch for the authenticated user
 * POST /api/skills/batch
 */
export const addSkillsBatch = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: 'Skills array must contain at least one skill'
      });
    }

    // Validate all items in payload
    for (const item of skills) {
      if (!item.name || typeof item.name !== 'string' || !item.name.trim()) {
        return res.status(400).json({
          message: 'All skills must have a valid name'
        });
      }
      const prof = item.proficiency;
      if (
        prof === undefined ||
        prof === null ||
        typeof prof !== 'number' ||
        !Number.isInteger(prof) ||
        prof < 1 ||
        prof > 5
      ) {
        return res.status(400).json({
          message: `Invalid proficiency for skill "${item.name}". Must be an integer between 1 and 5.`
        });
      }
    }

    const added = [];
    const updated = [];

    // Process each skill safely with escaped regex
    for (const item of skills) {
      const trimmedName = item.name.trim();
      const proficiency = item.proficiency;

      const existingSkill = await Skill.findOne({
        user: req.user._id,
        name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i') }
      });

      if (existingSkill) {
        existingSkill.proficiency = proficiency;
        await existingSkill.save();
        updated.push(existingSkill);
      } else {
        const newSkill = await Skill.create({
          user: req.user._id,
          name: trimmedName,
          proficiency
        });
        added.push(newSkill);
      }
    }

    // Fetch full updated skills list
    const allSkills = await Skill.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Batch processed successfully: ${added.length} added, ${updated.length} updated.`,
      addedCount: added.length,
      updatedCount: updated.length,
      skills: allSkills
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while processing batch skills',
      error: error.message
    });
  }
};

/**
 * Get all skills for the authenticated user
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Skills fetched successfully',
      count: skills.length,
      skills
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching skills',
      error: error.message
    });
  }
};

/**
 * Update a skill for the authenticated user
 * PATCH /api/skills/:id
 */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, proficiency } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid skill ID format'
      });
    }

    // Check if at least one field is provided
    if (name === undefined && proficiency === undefined) {
      return res.status(400).json({
        message: 'At least one field (name or proficiency) must be provided for update'
      });
    }

    const updates = {};

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          message: 'Skill name cannot be empty'
        });
      }
      updates.name = name.trim();

      // Check for duplicate skill name under same user (excluding this skill, safely escaped)
      const duplicateSkill = await Skill.findOne({
        user: req.user._id,
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${escapeRegex(updates.name)}$`, 'i') }
      });

      if (duplicateSkill) {
        return res.status(409).json({
          message: 'Another skill with this name already exists for this user'
        });
      }
    }

    // Validate proficiency if provided
    if (proficiency !== undefined) {
      if (
        typeof proficiency !== 'number' ||
        !Number.isInteger(proficiency) ||
        proficiency < 1 ||
        proficiency > 5
      ) {
        return res.status(400).json({
          message: 'Proficiency must be an integer between 1 and 5'
        });
      }
      updates.proficiency = proficiency;
    }

    // Find and update ensuring it belongs to authenticated user
    const updatedSkill = await Skill.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    return res.status(200).json({
      message: 'Skill updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Skill with this name already exists for this user'
      });
    }

    return res.status(500).json({
      message: 'Server error while updating skill',
      error: error.message
    });
  }
};

/**
 * Delete a skill for the authenticated user
 * DELETE /api/skills/:id
 */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid skill ID format'
      });
    }

    // Find and delete ensuring it belongs to authenticated user
    const deletedSkill = await Skill.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!deletedSkill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    return res.status(200).json({
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while deleting skill',
      error: error.message
    });
  }
};

/**
 * Shared helper to calculate skill gaps based on role requirements and user skills
 */
export const calculateSkillGaps = (roleRequirements, userSkills = []) => {
  // Map user skills for case-insensitive lookup
  const userSkillMap = new Map();
  userSkills.forEach((s) => {
    userSkillMap.set(s.name.trim().toLowerCase(), s.proficiency);
  });

  let achievedSkillsCount = 0;
  let skillsNeedingImprovementCount = 0;
  let missingSkillsCount = 0;
  let totalRequiredPoints = 0;
  let totalEarnedPoints = 0;

  const gaps = Object.entries(roleRequirements).map(([skillName, requiredProficiency]) => {
    const normalizedSkill = skillName.trim().toLowerCase();
    const hasSkill = userSkillMap.has(normalizedSkill);
    const currentProficiency = hasSkill ? userSkillMap.get(normalizedSkill) : 0;

    totalRequiredPoints += requiredProficiency;
    totalEarnedPoints += Math.min(currentProficiency, requiredProficiency);

    let status;
    if (!hasSkill) {
      status = 'missing';
      missingSkillsCount++;
    } else if (currentProficiency < requiredProficiency) {
      status = 'needs_improvement';
      skillsNeedingImprovementCount++;
    } else {
      status = 'achieved';
      achievedSkillsCount++;
    }

    // Exact gap calculation: never negative
    const gap = Math.max(0, requiredProficiency - currentProficiency);

    // Spectrum analysis & severity rating
    let severity;
    let impact;
    if (gap >= 3) {
      severity = 'critical';
      impact = 'High Impact';
    } else if (gap === 2) {
      severity = 'moderate';
      impact = 'Medium Impact';
    } else if (gap === 1) {
      severity = 'minor';
      impact = 'Low Impact';
    } else {
      severity = 'met';
      impact = 'Fulfilled';
    }

    const completionPercentage = Math.min(
      100,
      Math.round((currentProficiency / requiredProficiency) * 100)
    );

    return {
      skill: skillName,
      currentProficiency,
      requiredProficiency,
      gap,
      status,
      severity,
      impact,
      completionPercentage
    };
  });

  // Sort results by largest gap first
  gaps.sort((a, b) => b.gap - a.gap || a.skill.localeCompare(b.skill));

  const totalRequiredSkills = Object.keys(roleRequirements).length;
  const readinessPercentage =
    totalRequiredPoints > 0
      ? Math.round((totalEarnedPoints / totalRequiredPoints) * 100)
      : 0;

  const readinessExplanation =
    `Readiness score reflects competency points earned toward target role benchmarks (${totalEarnedPoints} of ${totalRequiredPoints} points, or ${readinessPercentage}%). Requirements serve as structured career goals.`;

  return {
    gaps,
    totalRequiredSkills,
    achievedSkillsCount,
    skillsNeedingImprovementCount,
    missingSkillsCount,
    totalRequiredPoints,
    totalEarnedPoints,
    readinessPercentage,
    readinessExplanation,
    criticalGapsCount: gaps.filter((g) => g.severity === 'critical').length,
    moderateGapsCount: gaps.filter((g) => g.severity === 'moderate').length,
    minorGapsCount: gaps.filter((g) => g.severity === 'minor').length
  };
};

/**
 * Calculate skill gaps for authenticated user based on their career goal
 * GET /api/skills/gaps
 */
export const getSkillGaps = async (req, res) => {
  try {
    // 1. Get authenticated user's career goal
    const careerGoal = await CareerGoal.findOne({ user: req.user._id });

    // 2. If no career goal exists, return 404
    if (!careerGoal || !careerGoal.targetRole) {
      return res.status(404).json({
        message: 'No career goal found. Please select a target role first.'
      });
    }

    const targetRole = careerGoal.targetRole;

    // 3. Get role requirements
    const roleRequirements = ROLE_REQUIREMENTS[targetRole];
    if (!roleRequirements) {
      return res.status(404).json({
        message: `Role requirements not found for target role: ${targetRole}`
      });
    }

    // 4. Fetch only the authenticated user's skills
    const userSkills = await Skill.find({ user: req.user._id });

    const {
      gaps,
      totalRequiredSkills,
      achievedSkillsCount,
      skillsNeedingImprovementCount,
      missingSkillsCount,
      totalRequiredPoints,
      totalEarnedPoints,
      readinessPercentage,
      readinessExplanation,
      criticalGapsCount,
      moderateGapsCount,
      minorGapsCount
    } = calculateSkillGaps(roleRequirements, userSkills);

    const summary = {
      targetRole,
      totalRequiredSkills,
      achievedSkillsCount,
      skillsNeedingImprovementCount,
      missingSkillsCount,
      totalRequiredPoints,
      totalEarnedPoints,
      readinessPercentage,
      readinessExplanation,
      criticalGapsCount,
      moderateGapsCount,
      minorGapsCount
    };

    return res.status(200).json({
      message: 'Skill gaps calculated successfully',
      targetRole,
      summary,
      totalRequiredSkills,
      achievedSkillsCount,
      skillsNeedingImprovementCount,
      missingSkillsCount,
      totalRequiredPoints,
      totalEarnedPoints,
      readinessPercentage,
      readinessExplanation,
      criticalGapsCount,
      moderateGapsCount,
      minorGapsCount,
      gaps,
      skillGaps: gaps
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while calculating skill gaps',
      error: error.message
    });
  }
};

