import { apiFetch } from './api';

/**
 * Fetches the backend health status from Express server.
 * @returns {Promise<{ status: string, message: string, timestamp: string }>}
 */
export async function getHealthStatus() {
  return apiFetch('/health');
}

