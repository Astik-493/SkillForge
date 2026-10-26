import { apiFetch } from './api';

export const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Basic' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
];

/**
 * Returns the human-readable proficiency label for a numeric level (0-5).
 * @param {number|string} value
 * @returns {string}
 */
export function getProficiencyLabel(value) {
  const num = Number(value);
  if (num === 0) return 'Not Started';
  const found = PROFICIENCY_LEVELS.find((p) => p.value === num);
  return found ? found.label : `Level ${num}`;
}

/**
 * Fetch all skills for the authenticated user.
 * Connects to GET /api/skills.
 * @returns {Promise<Array<{ _id: string, name: string, proficiency: number, createdAt: string }>>}
 */
export async function fetchSkills() {
  const result = await apiFetch('/skills');
  return result?.skills || [];
}

/**
 * Add a new skill for the authenticated user.
 * Connects to POST /api/skills.
 * @param {{ name: string, proficiency: number }} skillData
 * @returns {Promise<{ message: string, skill: object }>}
 */
export async function addSkill({ name, proficiency }) {
  return apiFetch('/skills', {
    method: 'POST',
    body: JSON.stringify({ name, proficiency: Number(proficiency) })
  });
}

/**
 * Add or update multiple skills in batch for the authenticated user.
 * Connects to POST /api/skills/batch.
 * @param {Array<{ name: string, proficiency: number }>} skills
 * @returns {Promise<{ message: string, addedCount: number, updatedCount: number, skills: Array<object> }>}
 */
export async function addSkillsBatch(skills) {
  return apiFetch('/skills/batch', {
    method: 'POST',
    body: JSON.stringify({ skills })
  });
}

/**
 * Update an existing skill's name and/or proficiency.
 * Connects to PATCH /api/skills/:id.
 * @param {string} id - Skill ID
 * @param {{ name?: string, proficiency?: number }} updates
 * @returns {Promise<{ message: string, skill: object }>}
 */
export async function updateSkill(id, updates) {
  const body = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.proficiency !== undefined) body.proficiency = Number(updates.proficiency);

  return apiFetch(`/skills/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * Delete a skill by ID.
 * Connects to DELETE /api/skills/:id.
 * @param {string} id - Skill ID
 * @returns {Promise<{ message: string }>}
 */
export async function deleteSkill(id) {
  return apiFetch(`/skills/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Fetch skill gaps based on authenticated user's target career goal.
 * Connects to GET /api/skills/gaps.
 * If no career goal exists (404), returns null or object indicating no goal.
 *
 * @returns {Promise<{
 *   targetRole: string,
 *   summary: {
 *     targetRole: string,
 *     totalRequiredSkills: number,
 *     achievedSkillsCount: number,
 *     skillsNeedingImprovementCount: number,
 *     missingSkillsCount: number
 *   },
 *   gaps: Array<{
 *     skill: string,
 *     currentProficiency: number,
 *     requiredProficiency: number,
 *     gap: number,
 *     status: 'missing' | 'needs_improvement' | 'achieved'
 *   }>
 * } | null>}
 */
export async function fetchSkillGaps() {
  try {
    const result = await apiFetch('/skills/gaps');
    return result;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}
