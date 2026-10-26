import { useState, useMemo } from 'react';
import {
  updateSkill,
  deleteSkill,
  PROFICIENCY_LEVELS,
  getProficiencyLabel
} from '../services/skillService';

export function SkillItem({ skill, onSkillUpdated, onSkillDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(skill.name);
  const [editProficiency, setEditProficiency] = useState(skill.proficiency);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const formattedDate = useMemo(() => {
    const raw = skill.updatedAt || skill.createdAt;
    if (!raw) return null;
    const dateObj = new Date(raw);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [skill.updatedAt, skill.createdAt]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = editName.trim();
    if (!trimmed) {
      setError('Skill name cannot be empty.');
      return;
    }

    const num = Number(editProficiency);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
      setError('Proficiency must be between 1 and 5.');
      return;
    }

    setSaving(true);
    try {
      const response = await updateSkill(skill._id, {
        name: trimmed,
        proficiency: num
      });

      setIsEditing(false);
      if (onSkillUpdated && response.skill) {
        onSkillUpdated(response.skill);
      }
    } catch (err) {
      setError(err.message || 'Failed to update skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(skill.name);
    setEditProficiency(skill.proficiency);
    setError(null);
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);
    try {
      await deleteSkill(skill._id);
      if (onSkillDeleted) {
        onSkillDeleted(skill._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete skill.');
      setDeleting(false);
    }
  };

  return (
    <div className={`skill-card ${isEditing ? 'editing' : ''}`}>
      {error && (
        <div className="alert alert-error skill-inline-alert" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="skill-edit-form">
          <div className="edit-fields-grid">
            <div className="form-group flex-2">
              <label className="form-label" htmlFor={`edit-name-${skill._id}`}>
                Skill Name
              </label>
              <input
                id={`edit-name-${skill._id}`}
                type="text"
                className="form-input form-input-sm"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={saving}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor={`edit-prof-${skill._id}`}>
                Proficiency
              </label>
              <select
                id={`edit-prof-${skill._id}`}
                className="form-input form-input-sm form-select"
                value={editProficiency}
                onChange={(e) => setEditProficiency(Number(e.target.value))}
                disabled={saving}
              >
                {PROFICIENCY_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.value} - {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="edit-actions">
            <button
              type="submit"
              className="btn-action-sm btn-save"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-action-sm btn-cancel"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="skill-card-body">
          <div className="skill-info">
            <div className="skill-name-row">
              <h4 className="skill-title">{skill.name}</h4>
              <span className={`proficiency-pill level-${skill.proficiency}`}>
                Level {skill.proficiency} &bull; {getProficiencyLabel(skill.proficiency)}
              </span>
              {formattedDate && (
                <span
                  className="skill-date-pill"
                  title={`Last updated on ${formattedDate}`}
                >
                  🕒 {formattedDate}
                </span>
              )}
            </div>

            {/* Visual 5-step proficiency meter */}
            <div
              className="proficiency-meter"
              aria-label={`Proficiency: ${skill.proficiency} of 5`}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`meter-bar ${level <= skill.proficiency ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>

          <div className="skill-card-actions">
            <button
              type="button"
              className="btn-icon-action btn-edit"
              onClick={() => setIsEditing(true)}
              disabled={deleting}
              aria-label={`Edit ${skill.name}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-icon-action btn-delete"
              onClick={handleDelete}
              disabled={deleting}
              aria-label={`Delete ${skill.name}`}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillItem;
