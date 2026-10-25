/**
 * Centralized API configuration and request helper for SkillForge client.
 * Connects to the Express backend on http://localhost:5001.
 */

export const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Universal fetch wrapper for backend API requests.
 * Handles JSON serialization, token authentication, and standardized error parsing.
 *
 * @param {string} endpoint - API endpoint path (e.g., '/users/register' or 'users/register')
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Automatically attach stored token if available and not explicitly overridden
  const token = localStorage.getItem('skillforge_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch {
    throw new Error(
      'Unable to connect to the server. Please ensure the backend is running on http://localhost:5001'
    );
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) ||
      `Request failed with status ${response.status} (${response.statusText || 'Error'})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiFetch;
