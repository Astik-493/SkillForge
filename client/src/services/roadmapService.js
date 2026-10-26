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
