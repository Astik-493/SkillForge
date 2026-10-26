import { apiFetch } from './api';

/**
 * Fetch personalized learning roadmap and project recommendations based on skill gaps.
 * Connects to GET /api/roadmap.
 * Returns null if no career goal is set (404).
 *
 * @returns {Promise<{
 *   message: string,
 *   targetRole: string,
 *   summary: {
 *     targetRole: string,
 *     totalRecommendations: number,
 *     missingSkillsCount: number,
 *     skillsNeedingImprovementCount: number
 *   },
 *   totalRecommendations: number,
 *   recommendations: Array<{
 *     skill: string,
 *     currentProficiency: number,
 *     requiredProficiency: number,
 *     gap: number,
 *     priority: 'High' | 'Medium' | 'Low',
 *     status: string,
 *     learningTopic: string,
 *     resourceUrl: string,
 *     projectIdea: string
 *   }>
 * } | null>}
 */
export async function fetchRoadmap() {
  try {
    const result = await apiFetch('/roadmap');
    return result;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch roadmap milestone progress records for active target role.
 * Connects to GET /api/roadmap/progress.
 * @returns {Promise<{ targetRole: string, progress: Array<object>, completedCount: number } | null>}
 */
export async function fetchRoadmapProgress() {
  try {
    return await apiFetch('/roadmap/progress');
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Update milestone completion status.
 * Connects to PUT /api/roadmap/progress.
 * @param {string} skill - Skill name
 * @param {boolean} completed - Completion status
 * @returns {Promise<{ message: string, progress: object }>}
 */
export async function updateRoadmapProgress(skill, completed) {
  return apiFetch('/roadmap/progress', {
    method: 'PUT',
    body: JSON.stringify({ skill, completed })
  });
}

