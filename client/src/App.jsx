import { useState, useEffect } from 'react';
import { getHealthStatus } from './services/healthService';
import './App.css';

function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHealthStatus();
      setHealthData(data);
    } catch (err) {
      setError(
        err.message || 'Unable to connect to backend server. Make sure it is running on http://localhost:5001'
      );
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getHealthStatus()
      .then((data) => {
        if (isMounted) {
          setHealthData(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.message || 'Unable to connect to backend server. Make sure it is running on http://localhost:5001'
          );
          setHealthData(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="env-badge">Dev Mode</span>
        <h1>SkillForge</h1>
        <p className="subtitle">Backend Connection &amp; Health Status</p>
      </header>

      <main className="status-card">
        <div className="card-header">
          <h2>Server Health Check</h2>
          <span className="target-url">GET /api/health</span>
        </div>

        {loading && (
          <div className="status-box loading">
            <div className="spinner"></div>
            <p>Checking connection to backend server...</p>
          </div>
        )}

        {!loading && error && (
          <div className="status-box error">
            <div className="status-header">
              <span className="status-dot error-dot"></span>
              <h3>Connection Failed</h3>
            </div>
            <p className="error-message">{error}</p>
            <p className="troubleshoot-tip">
              Tip: Verify that your backend server is running on <code>http://localhost:5001</code>.
            </p>
            <button type="button" className="btn-action btn-retry" onClick={fetchHealth}>
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && healthData && (
          <div className="status-box success">
            <div className="status-header">
              <span className="status-dot success-dot"></span>
              <h3>Connected to Backend</h3>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="status-pill">{healthData.status}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Message</span>
                <span className="info-value">{healthData.message}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Timestamp</span>
                <span className="info-value">{new Date(healthData.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <button type="button" className="btn-action btn-refresh" onClick={fetchHealth}>
              Refresh Health Status
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>SkillForge &bull; Client-Server Integration Test</p>
      </footer>
    </div>
  );
}

export default App;
