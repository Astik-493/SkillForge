import { getProficiencyLabel } from '../services/skillService';

export function SkillGapSection({ gapData, loading, error, onRetry, hasCareerGoal }) {
  if (!hasCareerGoal) {
    return (
      <section className="dashboard-section-card" aria-label="Skill Gap Analysis">
        <div className="section-title-bar">
          <h3>Skill Gap Analysis</h3>
          <span className="badge-dim">Requires Target Role</span>
        </div>
        <div className="empty-section-prompt">
          <div className="prompt-icon">🎯</div>
          <h4>No Career Goal Selected</h4>
          <p>Select and save a target role above to analyze your skill gaps against industry requirements.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="dashboard-section-card" aria-label="Skill Gap Analysis">
        <div className="section-title-bar">
          <h3>Skill Gap Analysis</h3>
        </div>
        <div className="status-box loading">
          <div className="spinner"></div>
          <p>Analyzing your skill gaps...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-section-card" aria-label="Skill Gap Analysis">
        <div className="section-title-bar">
          <h3>Skill Gap Analysis</h3>
        </div>
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
          {onRetry && (
            <button type="button" className="btn-retry-inline" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      </section>
    );
  }

  const summary = gapData?.summary || {
    targetRole: gapData?.targetRole || 'Target Role',
    totalRequiredSkills: 0,
    achievedSkillsCount: 0,
    skillsNeedingImprovementCount: 0,
    missingSkillsCount: 0
  };

  const gaps = gapData?.gaps || [];

  return (
    <section className="dashboard-section-card" aria-label="Skill Gap Analysis">
      <div className="section-title-bar">
        <div>
          <h3>Skill Gap Analysis</h3>
          <p className="section-subtitle">
            Targeting <strong>{summary.targetRole}</strong> &bull; {summary.totalRequiredSkills} required competencies
          </p>
        </div>
        <span className="count-pill">{gaps.length} skills</span>
      </div>

      {/* Summary KPI Badges */}
      <div className="metrics-grid">
        <div className="metric-card metric-total">
          <span className="metric-number">{summary.totalRequiredSkills}</span>
          <span className="metric-label">Total Required</span>
        </div>
        <div className="metric-card metric-achieved">
          <span className="metric-number">{summary.achievedSkillsCount}</span>
          <span className="metric-label">Achieved</span>
        </div>
        <div className="metric-card metric-improving">
          <span className="metric-number">{summary.skillsNeedingImprovementCount}</span>
          <span className="metric-label">Needs Improvement</span>
        </div>
        <div className="metric-card metric-missing">
          <span className="metric-number">{summary.missingSkillsCount}</span>
          <span className="metric-label">Missing</span>
        </div>
      </div>

      {/* Skills Gap List */}
      <div className="gap-list" role="list">
        {gaps.map((item) => {
          const statusKey = item.status || (item.gap === 0 ? 'achieved' : item.currentProficiency > 0 ? 'needs_improvement' : 'missing');
          const statusClass = `status-${statusKey}`;
          const statusLabel =
            statusKey === 'achieved'
              ? 'Achieved'
              : statusKey === 'needs_improvement'
              ? 'Needs Improvement'
              : 'Missing';

          return (
            <div key={item.skill} className={`gap-card ${statusClass}`} role="listitem">
              <div className="gap-card-header">
                <div className="gap-title-group">
                  <h4 className="gap-skill-title">{item.skill}</h4>
                  <span className={`status-badge-pill ${statusClass}`}>{statusLabel}</span>
                </div>
                <div className="gap-number-badge">
                  {item.gap > 0 ? (
                    <span className="gap-value-text">
                      Gap: <strong>+{item.gap}</strong>
                    </span>
                  ) : (
                    <span className="gap-met-text">Requirement Met ✓</span>
                  )}
                </div>
              </div>

              {/* Proficiency Level Comparison */}
              <div className="gap-comparison-row">
                <div className="proficiency-stat">
                  <span className="stat-label">Current:</span>
                  <span className="stat-value">
                    Level {item.currentProficiency} ({getProficiencyLabel(item.currentProficiency)})
                  </span>
                </div>
                <span className="comparison-arrow">&rarr;</span>
                <div className="proficiency-stat">
                  <span className="stat-label">Target:</span>
                  <span className="stat-value">
                    Level {item.requiredProficiency} ({getProficiencyLabel(item.requiredProficiency)})
                  </span>
                </div>
              </div>

              {/* Visual Multi-Segment Comparison Bar */}
              <div
                className="gap-meter-bar-container"
                aria-label={`Current ${item.currentProficiency} of Required ${item.requiredProficiency}`}
              >
                {[1, 2, 3, 4, 5].map((level) => {
                  const isCurrent = level <= item.currentProficiency;
                  const isRequired = level <= item.requiredProficiency;

                  let segmentClass = 'segment-empty';
                  if (isCurrent) {
                    segmentClass = 'segment-current';
                  } else if (isRequired) {
                    segmentClass = 'segment-gap';
                  }

                  return <div key={level} className={`gap-meter-segment ${segmentClass}`} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SkillGapSection;
