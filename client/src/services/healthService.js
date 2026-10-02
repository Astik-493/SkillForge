const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Fetches the backend health status from Express server.
 * @returns {Promise<{ status: string, message: string, timestamp: string }>}
 */
export async function getHealthStatus() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status} (${response.statusText || 'Error'})`);
  }

  return response.json();
}
