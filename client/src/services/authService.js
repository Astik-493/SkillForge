import { apiFetch } from './api';

const TOKEN_KEY = 'skillforge_token';
const USER_KEY = 'skillforge_user';

/**
 * Register a new user with name, email, and password.
 * Connects to POST /api/users/register.
 *
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ message: string, user: { _id: string, name: string, email: string } }>}
 */
export async function registerUser({ name, email, password }) {
  return apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

/**
 * Authenticate user with email and password.
 * Connects to POST /api/users/login.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ message: string, token: string, user: { _id: string, name: string, email: string } }>}
 */
export async function loginUser({ email, password }) {
  const result = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (result && result.token) {
    setToken(result.token);
    if (result.user) {
      setUser(result.user);
    }
  }

  return result;
}

/**
 * Fetch the authenticated user's profile.
 * Connects to GET /api/users/profile.
 *
 * @returns {Promise<{ message: string, user: { _id: string, name: string, email: string } }>}
 */
export async function getUserProfile() {
  return apiFetch('/users/profile');
}

/**
 * Get stored JWT token from localStorage.
 * @returns {string | null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store JWT token in localStorage.
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get cached user details from localStorage.
 * @returns {object | null}
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Cache user details in localStorage.
 * @param {object} user
 */
export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear stored credentials on logout.
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
