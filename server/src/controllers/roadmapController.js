import CareerGoal from '../models/careerGoal.model.js';
import Skill from '../models/skill.model.js';
import RoadmapProgress from '../models/roadmapProgress.model.js';
import { ROLE_REQUIREMENTS } from '../config/roleRequirements.js';
import { calculateSkillGaps } from './skillController.js';
import { getLearningResource } from '../config/learningResources.js';

/**
 * Generate personalized learning roadmap and project recommendations based on skill gaps,
 * merged with the authenticated user's persistent learning milestone progress.
 * GET /api/roadmap
 */
export const getRoadmap = async (req, res) => {
  try {
    // 1. Fetch authenticated user's career goal
    const careerGoal = await CareerGoal.findOne({ user: req.user._id });

    // 2. Return 404 if no career goal exists
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

    // 4. Fetch the authenticated user's skills
    const userSkills = await Skill.find({ user: req.user._id });

    // 5. Calculate skill gaps using shared logic
    const { gaps } = calculateSkillGaps(roleRequirements, userSkills);

    // 6. Filter out skills already meeting required proficiency (gap === 0), keep gap > 0
    const pendingGaps = gaps.filter((item) => item.gap > 0);

    // 7. Fetch persistent milestone progress records for this user and target role
    const progressRecords = await RoadmapProgress.find({
      user: req.user._id,
      targetRole
    });

    const progressMap = new Map();
    progressRecords.forEach((record) => {
      progressMap.set(record.skill.toLowerCase(), {
        completed: Boolean(record.completed),
        completedAt: record.completedAt
      });
    });

    // 8. Return a useful message if no skill gaps remain
    if (pendingGaps.length === 0) {
      return res.status(200).json({
        message: 'Congratulations! You have achieved all required proficiencies for your target role.',
        targetRole,
        summary: {
          targetRole,
          totalRecommendations: 0,
          missingSkillsCount: 0,
          skillsNeedingImprovementCount: 0,
          completedMilestonesCount: 0,
          progressPercentage: 100
        },
        totalRecommendations: 0,
        recommendations: []
      });
    }

    // 9. Generate recommendations with learning resource, project idea, and progress tracking
    let missingSkillsCount = 0;
    let skillsNeedingImprovementCount = 0;
    let completedMilestonesCount = 0;

    const recommendations = pendingGaps.map((item) => {
      if (item.status === 'missing') {
        missingSkillsCount++;
      } else {
        skillsNeedingImprovementCount++;
      }

      const priority = item.gap >= 3 ? 'High' : item.gap === 2 ? 'Medium' : 'Low';
      const resource = getLearningResource(item.skill);
      const userProgress = progressMap.get(item.skill.toLowerCase());
      const isCompleted = userProgress ? userProgress.completed : false;
      const completedAt = userProgress ? userProgress.completedAt : null;

      if (isCompleted) {
        completedMilestonesCount++;
      }

      return {
        skill: item.skill,
        currentProficiency: item.currentProficiency,
        requiredProficiency: item.requiredProficiency,
        gap: item.gap,
        priority,
        status: item.status,
        learningTopic: resource.learningTopic,
        resourceUrl: resource.resourceUrl,
        projectIdea: resource.projectIdea,
        isCompleted,
        completedAt
      };
    });

    const progressPercentage =
      recommendations.length > 0
        ? Math.round((completedMilestonesCount / recommendations.length) * 100)
        : 100;

    const summary = {
      targetRole,
      totalRecommendations: recommendations.length,
      missingSkillsCount,
      skillsNeedingImprovementCount,
      completedMilestonesCount,
      progressPercentage
    };

    return res.status(200).json({
      message: 'Personalized learning roadmap generated successfully',
      targetRole,
      summary,
      totalRecommendations: recommendations.length,
      recommendations
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while generating learning roadmap',
      error: error.message
    });
  }
};

/**
 * Get learning progress for authenticated user for their active target role
 * GET /api/roadmap/progress
 */
export const getRoadmapProgress = async (req, res) => {
  try {
    const careerGoal = await CareerGoal.findOne({ user: req.user._id });

    if (!careerGoal || !careerGoal.targetRole) {
      return res.status(404).json({
        message: 'No career goal found. Please select a target role first.'
      });
    }

    const targetRole = careerGoal.targetRole;
    const records = await RoadmapProgress.find({ user: req.user._id, targetRole });

    const completedCount = records.filter((r) => r.completed).length;

    return res.status(200).json({
      message: 'Roadmap progress fetched successfully',
      targetRole,
      progress: records,
      completedCount
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while fetching roadmap progress',
      error: error.message
    });
  }
};

/**
 * Update completion status for a learning roadmap milestone
 * PUT /api/roadmap/progress
 */
export const updateRoadmapProgress = async (req, res) => {
  try {
    const { skill, completed } = req.body;

    // Validate skill
    if (!skill || typeof skill !== 'string' || !skill.trim()) {
      return res.status(400).json({
        message: 'Skill name is required'
      });
    }

    // Validate completed
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        message: 'Completed must be a boolean value'
      });
    }

    // Get user's active career goal
    const careerGoal = await CareerGoal.findOne({ user: req.user._id });
    if (!careerGoal || !careerGoal.targetRole) {
      return res.status(404).json({
        message: 'No career goal found. Please select a target role first.'
      });
    }

    const targetRole = careerGoal.targetRole;
    const trimmedSkill = skill.trim();

    // Upsert completion record for this user, role, and skill
    const progressRecord = await RoadmapProgress.findOneAndUpdate(
      {
        user: req.user._id,
        targetRole,
        skill: trimmedSkill
      },
      {
        $set: {
          user: req.user._id,
          targetRole,
          skill: trimmedSkill,
          completed,
          completedAt: completed ? new Date() : null
        }
      },
      {
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      message: 'Progress updated successfully',
      progress: progressRecord
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error while updating roadmap progress',
      error: error.message
    });
  }
};
