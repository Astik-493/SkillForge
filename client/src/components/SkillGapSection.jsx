import { useState, useMemo } from 'react';
import { getProficiencyLabel } from '../services/skillService';

export function SkillGapSection({ gapData, loading, error, onRetry, hasCareerGoal }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'needs_improvement' | 'missing' | 'achieved'

  const gaps = useMemo(() => gapData?.gaps || [], [gapData]);

  const filteredGaps = useMemo(() => {
    if (filter === 'all') return gaps;
    return gaps.filter((g) => {
      const statusKey =
        g.status ||
        (g.gap === 0 ? 'achieved' : g.currentProficiency > 0 ? 'needs_improvement' : 'missing');
      return statusKey === filter;
    });
  }, [gaps, filter]);

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

  const targetRole = gapData?.targetRole || 'Target Role';
  const achievedCount = gaps.filter((g) => g.gap === 0).length;
  const improvingCount = gaps.filter((g) => g.gap > 0 && g.currentProficiency > 0).length;
  const missingCount = gaps.filter((g) => g.currentProficiency === 0).length;

  return (
    <section className="dashboard-section-card" aria-label="Skill Gap Analysis">
      <div className="section-title-bar">
        <div>
          <h3>Skill Gap Breakdown</h3>
          <p className="section-subtitle">
            Competency comparison against <strong>{targetRole}</strong> industry expectations
          </p>
        </div>
        <span className="count-pill">{gaps.length} skills analyzed</span>
      </div>

      {/* Filter Chips Bar */}
      <div className="gap-filter-bar">
        <button
          type="button"
          className={`gap-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({gaps.length})
        </button>
        <button
          type="button"
          className={`gap-filter-btn ${filter === 'needs_improvement' ? 'active' : ''}`}
          onClick={() => setFilter('needs_improvement')}
        >
          Underdeveloped ({improvingCount})
        </button>
        <button
          type="button"
          className={`gap-filter-btn ${filter === 'missing' ? 'active' : ''}`}
          onClick={() => setFilter('missing')}
        >
          Missing ({missingCount})
        </button>
        <button
          type="button"
          className={`gap-filter-btn ${filter === 'achieved' ? 'active' : ''}`}
          onClick={() => setFilter('achieved')}
        >
          Achieved ({achievedCount})
        </button>
      </div>

      {/* Skills Gap List */}
      <div className="gap-list" role="list">
        {filteredGaps.length === 0 ? (
          <div className="empty-filter-state">
            <p>No skills found under the &ldquo;{filter}&rdquo; category.</p>
          </div>
        ) : (
          filteredGaps.map((item) => {
            const statusKey =
              item.status ||
              (item.gap === 0 ? 'achieved' : item.currentProficiency > 0 ? 'needs_improvement' : 'missing');
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
                    {item.severity && (
                      <span className={`severity-chip ${item.severity}`}>
                        {item.impact || (item.gap > 0 ? `+${item.gap} Gap` : 'Fulfilled')}
                      </span>
                    )}
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
                  aria-label={`Current Level ${item.currentProficiency} of Required Level ${item.requiredProficiency}`}
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

                {/* Proportional Actionable Recommendation */}
                <div className="gap-action-recommendation">
                  <span className="rec-bullet">&bull;</span>
                  <span className="rec-text">
                    {item.gap >= 3
                      ? `High-Impact Priority: Substantial gap. Start with foundational tutorials and practical exercises to bridge from Level ${item.currentProficiency} to Level ${item.requiredProficiency}.`
                      : item.gap === 2
                      ? `Medium-Impact: Intermediate gap. Build targeted projects to elevate your proficiency toward Level ${item.requiredProficiency}.`
                      : item.gap === 1
                      ? `Low-Impact Refinement: Close to benchmark. Review advanced concepts and real-world patterns to reach Level ${item.requiredProficiency}.`
                      : `Benchmark Achieved: Fully satisfies industry requirements for ${targetRole}.`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default SkillGapSection;
