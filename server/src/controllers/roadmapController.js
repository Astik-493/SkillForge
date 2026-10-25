import CareerGoal from '../models/careerGoal.model.js';
import Skill from '../models/skill.model.js';
import { ROLE_REQUIREMENTS } from '../config/roleRequirements.js';
import { calculateSkillGaps } from './skillController.js';
import { getLearningResource } from '../config/learningResources.js';

/**
 * Generate personalized learning roadmap and project recommendations based on skill gaps
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

    // 6 & 9. Filter out skills already meeting required proficiency (gap === 0), keep gap > 0
    // Note: calculateSkillGaps already sorts by largest gap first
    const pendingGaps = gaps.filter((item) => item.gap > 0);

    // 10. Return a useful message if no skill gaps remain
    if (pendingGaps.length === 0) {
      return res.status(200).json({
        message: 'Congratulations! You have achieved all required proficiencies for your target role.',
        targetRole,
        summary: {
          targetRole,
          totalRecommendations: 0,
          missingSkillsCount: 0,
          skillsNeedingImprovementCount: 0
        },
        totalRecommendations: 0,
        recommendations: []
      });
    }

    // 7 & 8. Generate recommendations with learning resource and project idea
    let missingSkillsCount = 0;
    let skillsNeedingImprovementCount = 0;

    const recommendations = pendingGaps.map((item) => {
      if (item.status === 'missing') {
        missingSkillsCount++;
      } else {
        skillsNeedingImprovementCount++;
      }

      // Priority based on gap magnitude
      const priority = item.gap >= 3 ? 'High' : item.gap === 2 ? 'Medium' : 'Low';
      const resource = getLearningResource(item.skill);

      return {
        skill: item.skill,
        currentProficiency: item.currentProficiency,
        requiredProficiency: item.requiredProficiency,
        gap: item.gap,
        priority,
        status: item.status,
        learningTopic: resource.learningTopic,
        resourceUrl: resource.resourceUrl,
        projectIdea: resource.projectIdea
      };
    });

    const summary = {
      targetRole,
      totalRecommendations: recommendations.length,
      missingSkillsCount,
      skillsNeedingImprovementCount
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
