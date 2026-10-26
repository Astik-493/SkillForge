import { apiFetch } from './api';

export const SUPPORTED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Machine Learning Engineer'
];

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

/**
 * Save or update the authenticated user's target career goal.
 * Connects to PUT /api/career-goal.
 *
 * @param {string} targetRole
 * @returns {Promise<{ message: string, careerGoal: { targetRole: string } }>}
 */
export async function saveCareerGoal(targetRole) {
  return apiFetch('/career-goal', {
    method: 'PUT',
    body: JSON.stringify({ targetRole })
  });
}
