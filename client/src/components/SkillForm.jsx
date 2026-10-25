import { useState } from 'react';
import { addSkill, PROFICIENCY_LEVELS } from '../services/skillService';

export function SkillForm({ onSkillAdded }) {
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter a skill name.');
      return;
    }

    const numProficiency = Number(proficiency);
    if (!Number.isInteger(numProficiency) || numProficiency < 1 || numProficiency > 5) {
      setError('Proficiency must be an integer between 1 and 5.');
      return;
    }

    setLoading(true);

    try {
      const response = await addSkill({
        name: trimmedName,
        proficiency: numProficiency
      });

      setSuccess(`Added "${trimmedName}" successfully!`);
      setName('');
      setProficiency(3);

      if (onSkillAdded && response.skill) {
        onSkillAdded(response.skill);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to add skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-form-card">
      <div className="card-header-compact">
        <h3>Add New Skill</h3>
        <span className="section-badge">Proficiency 1–5</span>
      </div>

      <form onSubmit={handleSubmit} className="skill-form" noValidate>
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

        <div className="form-row-grid">
          <div className="form-group flex-2">
            <label className="form-label" htmlFor="skill-name-input">
              Skill Name
            </label>
            <input
              id="skill-name-input"
              type="text"
              className="form-input"
              placeholder="e.g. React, Python, MongoDB"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label" htmlFor="skill-proficiency-select">
              Proficiency Level
            </label>
            <select
              id="skill-proficiency-select"
              className="form-input form-select"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              disabled={loading}
            >
              {PROFICIENCY_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.value} - {lvl.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-btn">
            <label className="form-label sr-only">Action</label>
            <button
              type="submit"
              className="btn-submit btn-add-skill"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Adding...</span>
                </>
              ) : (
                '+ Add Skill'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SkillForm;
