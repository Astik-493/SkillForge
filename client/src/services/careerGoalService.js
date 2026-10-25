import { apiFetch } from './api';

/**
 * Fetch the authenticated user's career goal.
 * Connects to GET /api/career-goal.
 * Returns null if no career goal is set yet (404).
 *
 * @returns {Promise<{ targetRole: string } | null>}
 */
export async function fetchCareerGoal() {
  try {
    const result = await apiFetch('/career-goal');
    return result?.careerGoal || null;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}
