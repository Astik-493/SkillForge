import { apiFetch } from './api';

export const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Basic' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
];

/**
 * Returns the human-readable proficiency label for a numeric level (1-5).
 * @param {number|string} value
 * @returns {string}
 */
export function getProficiencyLabel(value) {
  const num = Number(value);
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
