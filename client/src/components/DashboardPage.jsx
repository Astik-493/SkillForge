import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getHealthStatus } from '../services/healthService';

export function DashboardPage({ onNavigate }) {
  const { user, logout } = useAuth();

  const [healthData, setHealthData] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthError, setHealthError] = useState(null);

  const checkHealth = async () => {
    setCheckingHealth(true);
    setHealthError(null);
    try {
      const data = await getHealthStatus();
      setHealthData(data);
    } catch (err) {
      setHealthError(err.message || 'Health check failed');
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
    : 'U';

  return (
    <div className="dashboard-card">
      <div className="user-banner">
        <div className="user-avatar" aria-label="User avatar">
          {initials}
        </div>
        <div className="user-meta">
          <h3>{user?.name || 'SkillForge User'}</h3>
          <p>{user?.email || 'Authenticated Account'}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-box">
          <span className="dashboard-box-title">Session Security</span>
          <div className="session-info">
            <span>Status:</span>
            <span className="badge-active">
              <span className="badge-dot"></span>
              JWT Authenticated
            </span>
          </div>
          <div className="session-info">
            <span>User ID:</span>
            <code>{user?._id || user?.id || 'Active'}</code>
          </div>
        </div>

        <div className="dashboard-box">
          <span className="dashboard-box-title">Milestone 14A Status</span>
          <p className="placeholder-note">
            Authentication successfully verified. User registration, secure login, and
            JWT storage in <code>localStorage</code> are fully active. Skills management
            and learning roadmaps will be mounted here in future milestones.
          </p>
        </div>

        {healthData && (
          <div className="dashboard-box">
            <span className="dashboard-box-title">Backend Connection</span>
            <div className="session-info">
              <span>Server Message:</span>
              <span>{healthData.message}</span>
            </div>
            <div className="session-info">
              <span>Health Status:</span>
              <span className="status-pill">{healthData.status}</span>
            </div>
          </div>
        )}

        {healthError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{healthError}</span>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={checkHealth}
          disabled={checkingHealth}
        >
          {checkingHealth ? 'Checking...' : 'Check Server Health'}
        </button>

        <button
          type="button"
          className="btn-logout"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
