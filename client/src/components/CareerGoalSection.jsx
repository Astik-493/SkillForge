import { useState } from 'react';
import { SUPPORTED_ROLES, ROLE_METADATA, saveCareerGoal } from '../services/careerGoalService';

export function CareerGoalSection({ currentRole, onGoalSaved }) {
  const [selectedRole, setSelectedRole] = useState(currentRole || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedRole) {
      setError('Please select a target career role.');
      return;
    }

    setSaving(true);
    try {
      const response = await saveCareerGoal(selectedRole);
      const savedRole = response.careerGoal?.targetRole || selectedRole;
      setSuccess(`Target role saved as "${savedRole}"!`);

      if (onGoalSaved) {
        onGoalSaved(savedRole);
      }

      setTimeout(() => {
        setSuccess(null);
      }, 3500);
    } catch (err) {
      setError(err.message || 'Failed to save career goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanged = selectedRole && selectedRole !== (currentRole || '');
  const activeMeta = selectedRole ? ROLE_METADATA[selectedRole] : null;

  return (
    <div className="career-goal-card" id="career-goal-section" aria-label="Career Goal Selection">
      <div className="card-header-compact">
        <div className="goal-title-group">
          <h3>Target Career Role</h3>
          <p className="goal-subtitle">
            Choose an engineering track to benchmark your skills, calculate gap readiness, and unlock curated roadmaps.
          </p>
        </div>
        {currentRole ? (
          <span className="goal-current-pill">
            Active: <strong>{currentRole}</strong>
          </span>
        ) : (
          <span className="goal-empty-pill">No role selected yet</span>
        )}
      </div>

      <form onSubmit={handleSave} className="goal-form">
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="status">
            <span className="alert-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <div className="goal-controls-row">
          <div className="form-group flex-1">
            <label className="form-label" htmlFor="career-role-select">
              Select Target Role ({SUPPORTED_ROLES.length} Available Tracks)
            </label>
            <select
              id="career-role-select"
              className="form-input form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={saving}
            >
              <option value="" disabled>
                -- Choose a supported career path --
              </option>
              {SUPPORTED_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role} {ROLE_METADATA[role]?.category ? `(${ROLE_METADATA[role].category})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-btn">
            <label className="form-label sr-only">Save Goal</label>
            <button
              type="submit"
              className="btn-submit btn-save-goal"
              disabled={saving || !selectedRole || (!hasChanged && Boolean(currentRole))}
            >
              {saving ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Saving...</span>
                </>
              ) : currentRole ? (
                'Update Goal'
              ) : (
                'Save Target Goal'
              )}
            </button>
          </div>
        </div>

        {/* Selected Role Insight Preview */}
        {activeMeta && (
          <div className="role-preview-card">
            <div className="role-preview-header">
              <span className="role-preview-category">{activeMeta.category}</span>
              <p className="role-preview-desc">{activeMeta.description}</p>
            </div>
            {activeMeta.coreSkills && (
              <div className="role-preview-skills">
                <span className="preview-skills-label">Core Competencies:</span>
                <div className="preview-skills-list">
                  {activeMeta.coreSkills.map((s) => (
                    <span key={s} className="preview-skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default CareerGoalSection;
