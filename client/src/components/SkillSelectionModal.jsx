import { useState, useMemo } from 'react';
import { SKILL_CATEGORIES } from '../config/skillCatalog';
import { PROFICIENCY_LEVELS, addSkillsBatch } from '../services/skillService';

export function SkillSelectionModal({ isOpen, onClose, existingSkills = [], onSkillsAdded }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Staging map: { [skillName]: proficiencyNumber }
  const [stagedSkills, setStagedSkills] = useState({});

  // Custom skill input
  const [customName, setCustomName] = useState('');
  const [customProficiency, setCustomProficiency] = useState(3);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Set of existing skill names (normalized lower case)
  const existingSkillMap = useMemo(() => {
    const map = new Map();
    existingSkills.forEach((s) => {
      map.set(s.name.trim().toLowerCase(), s.proficiency);
    });
    return map;
  }, [existingSkills]);

  // Filter skills based on category and search query
  const filteredCatalog = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return SKILL_CATEGORIES.filter((category) => {
      if (selectedCategory !== 'all' && category.id !== selectedCategory) {
        return false;
      }
      return true;
    }).map((category) => {
      const matchingSkills = category.skills.filter((skill) => {
        if (!query) return true;
        return skill.toLowerCase().includes(query);
      });
      return {
        ...category,
        skills: matchingSkills
      };
    }).filter((category) => category.skills.length > 0);
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleToggleSkill = (skillName) => {
    setError(null);
    setStagedSkills((prev) => {
      const next = { ...prev };
      if (next[skillName] !== undefined) {
        delete next[skillName];
      } else {
        // Default proficiency level 3 (Intermediate)
        next[skillName] = 3;
      }
      return next;
    });
  };

  const handleSetProficiency = (skillName, level) => {
    setStagedSkills((prev) => ({
      ...prev,
      [skillName]: Number(level)
    }));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    setError(null);
    const trimmed = customName.trim();
    if (!trimmed) {
      setError('Please enter a custom skill name.');
      return;
    }

    if (existingSkillMap.has(trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already in your skills profile.`);
      return;
    }

    setStagedSkills((prev) => ({
      ...prev,
      [trimmed]: Number(customProficiency)
    }));
    setCustomName('');
    setCustomProficiency(3);
  };

  const handleRemoveStaged = (skillName) => {
    setStagedSkills((prev) => {
      const next = { ...prev };
      delete next[skillName];
      return next;
    });
  };

  const handleSubmitBatch = async () => {
    const stagedEntries = Object.entries(stagedSkills);
    if (stagedEntries.length === 0) {
      setError('Please select at least one skill to add.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = stagedEntries.map(([name, proficiency]) => ({
      name,
      proficiency
    }));

    try {
      const result = await addSkillsBatch(payload);
      setSuccess(
        `Added ${result.addedCount || payload.length} skills successfully!`
      );
      setStagedSkills({});

      if (onSkillsAdded) {
        onSkillsAdded(result.skills);
      }

      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save skills. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stagedCount = Object.keys(stagedSkills).length;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="skill-catalog-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 id="modal-title">Searchable Skill Library</h3>
            <p className="modal-subtitle">
              Browse domain categories, search by keyword, and batch-add skills to your profile.
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        {/* Proficiency Scale Legend */}
        <div className="proficiency-legend-banner">
          <span className="legend-title">Proficiency Scale:</span>
          <div className="legend-items">
            {PROFICIENCY_LEVELS.map((lvl) => (
              <span key={lvl.value} className="legend-chip">
                <strong>L{lvl.value}</strong>: {lvl.label}
              </span>
            ))}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="catalog-toolbar">
          <div className="search-bar-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="catalog-search-input"
              placeholder="Search skills (e.g. React, Python, Docker, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          <div className="category-pill-filter" role="tablist" aria-label="Skill Categories">
            <button
              type="button"
              className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Two-Pane Grid (Catalog on Left, Staging Tray on Right) */}
        <div className="modal-grid-content">
          {/* Left Pane: Curated Catalog */}
          <div className="catalog-pane">
            {filteredCatalog.length === 0 ? (
              <div className="empty-catalog-state">
                <p>No skills found matching &ldquo;{searchQuery}&rdquo;.</p>
                <p className="subtext">You can add it as a custom skill in the tray on the right.</p>
              </div>
            ) : (
              filteredCatalog.map((cat) => (
                <div key={cat.id} className="category-group">
                  <div className="category-group-title">
                    <span className="cat-icon">{cat.icon}</span>
                    <h4>{cat.name}</h4>
                    <span className="count-tag">{cat.skills.length}</span>
                  </div>
                  <div className="skill-chip-grid">
                    {cat.skills.map((skill) => {
                      const lower = skill.toLowerCase();
                      const alreadyAdded = existingSkillMap.has(lower);
                      const isStaged = stagedSkills[skill] !== undefined;

                      return (
                        <button
                          key={skill}
                          type="button"
                          className={`skill-catalog-chip ${alreadyAdded ? 'already-owned' : ''} ${
                            isStaged ? 'staged' : ''
                          }`}
                          disabled={alreadyAdded}
                          onClick={() => handleToggleSkill(skill)}
                          title={alreadyAdded ? `Already in your profile (Level ${existingSkillMap.get(lower)})` : `Click to ${isStaged ? 'remove' : 'select'}`}
                        >
                          <span className="chip-name">{skill}</span>
                          {alreadyAdded ? (
                            <span className="chip-status-tag">L{existingSkillMap.get(lower)} (Added)</span>
                          ) : isStaged ? (
                            <span className="chip-check-icon">✓</span>
                          ) : (
                            <span className="chip-plus-icon">+</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Pane: Staged Skills Tray & Custom Skill Entry */}
          <div className="staging-pane">
            <div className="staging-header">
              <h4>Selected Skills ({stagedCount})</h4>
              {stagedCount > 0 && (
                <button
                  type="button"
                  className="btn-text-clear"
                  onClick={() => setStagedSkills({})}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Custom Skill Input */}
            <form onSubmit={handleAddCustomSkill} className="custom-skill-form">
              <label className="custom-label" htmlFor="custom-skill-name">
                Add Custom Skill:
              </label>
              <div className="custom-input-row">
                <input
                  id="custom-skill-name"
                  type="text"
                  className="form-input form-input-sm"
                  placeholder="e.g. WebSockets, C++"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <select
                  className="form-input form-select-sm"
                  value={customProficiency}
                  onChange={(e) => setCustomProficiency(Number(e.target.value))}
                >
                  {PROFICIENCY_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      L{lvl.value} - {lvl.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-add-custom" title="Stage custom skill">
                  + Add
                </button>
              </div>
            </form>

            {/* Feedback Alerts */}
            {error && (
              <div className="alert alert-error alert-sm" role="alert">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-sm" role="status">
                <span className="alert-icon">✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Staged List */}
            <div className="staged-list" role="list">
              {stagedCount === 0 ? (
                <div className="empty-staging-prompt">
                  <span className="prompt-icon">👈</span>
                  <p>Click skills on the left catalog or type a custom skill above to configure your proficiency.</p>
                </div>
              ) : (
                Object.entries(stagedSkills).map(([name, level]) => (
                  <div key={name} className="staged-skill-item" role="listitem">
                    <div className="staged-skill-info">
                      <span className="staged-skill-name">{name}</span>
                      <button
                        type="button"
                        className="btn-remove-staged"
                        onClick={() => handleRemoveStaged(name)}
                        title={`Remove ${name}`}
                      >
                        &times;
                      </button>
                    </div>

                    <div className="staged-proficiency-selector">
                      <span className="selector-label">Proficiency:</span>
                      <div className="level-buttons-group">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            className={`level-btn ${level === lvl ? 'active' : ''}`}
                            onClick={() => handleSetProficiency(name, lvl)}
                            title={`Level ${lvl} (${PROFICIENCY_LEVELS[lvl - 1].label})`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                      <span className="level-label-text">
                        {PROFICIENCY_LEVELS[level - 1]?.label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit btn-modal-save"
                disabled={submitting || stagedCount === 0}
                onClick={handleSubmitBatch}
              >
                {submitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Saving {stagedCount} skills...</span>
                  </>
                ) : (
                  `Add ${stagedCount} Selected Skill${stagedCount === 1 ? '' : 's'}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillSelectionModal;
