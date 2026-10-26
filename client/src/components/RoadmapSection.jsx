import { useState } from 'react';
import { getProficiencyLabel } from '../services/skillService';
import { updateRoadmapProgress } from '../services/roadmapService';

export function RoadmapSection({
  roadmapData,
  loading,
  error,
  onRetry,
  hasCareerGoal,
  onMilestoneToggled
}) {
  // Optimistic overrides map { [skillName]: boolean } for instantaneous UI updates
  const [overrides, setOverrides] = useState({});
  const [updatingSkill, setUpdatingSkill] = useState(null);
  const [toggleError, setToggleError] = useState(null);

  const getIsCompleted = (rec) => {
    return overrides[rec.skill] !== undefined ? overrides[rec.skill] : Boolean(rec.isCompleted);
  };

  if (!hasCareerGoal) {
    return (
      <section className="dashboard-section-card" id="roadmap-section" aria-label="Personalized Learning Roadmap">
        <div className="section-title-bar">
          <h3>Personalized Learning Roadmap</h3>
          <span className="badge-dim">Requires Target Role</span>
        </div>
        <div className="empty-section-prompt">
          <div className="prompt-icon">🗺️</div>
          <h4>Roadmap Awaiting Career Goal</h4>
          <p>Select your target role above to generate curated learning resources and project ideas tailored to your gaps.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="dashboard-section-card" id="roadmap-section" aria-label="Personalized Learning Roadmap">
        <div className="section-title-bar">
          <h3>Personalized Learning Roadmap</h3>
        </div>
        <div className="status-box loading">
          <div className="spinner"></div>
          <p>Generating your personalized learning roadmap...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-section-card" id="roadmap-section" aria-label="Personalized Learning Roadmap">
        <div className="section-title-bar">
          <h3>Personalized Learning Roadmap</h3>
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

  const recommendations = roadmapData?.recommendations || [];
  const targetRole = roadmapData?.targetRole || 'Your Target Role';

  // Empty state when all skills meet or exceed requirement
  if (recommendations.length === 0) {
    return (
      <section className="dashboard-section-card" id="roadmap-section" aria-label="Personalized Learning Roadmap">
        <div className="section-title-bar">
          <h3>Personalized Learning Roadmap</h3>
          <span className="badge-success-pill">All Skills Achieved! 🎉</span>
        </div>
        <div className="empty-roadmap-congrats">
          <div className="congrats-icon">🏆</div>
          <h4>Outstanding Achievement!</h4>
          <p className="congrats-text">
            {roadmapData?.message ||
              `You have reached or exceeded all required proficiencies for ${targetRole}! No pending skill gaps remain.`}
          </p>
          <p className="congrats-sub">
            Keep building advanced portfolio projects or choose another target career role to continue expanding your expertise.
          </p>
        </div>
      </section>
    );
  }

  // Calculate live completion counts
  const totalItems = recommendations.length;
  const completedCount = recommendations.filter((r) => getIsCompleted(r)).length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const handleToggle = async (skill, currentlyDone) => {
    setToggleError(null);
    const nextCompleted = !currentlyDone;

    // Optimistic UI update
    setOverrides((prev) => ({
      ...prev,
      [skill]: nextCompleted
    }));
    setUpdatingSkill(skill);

    try {
      await updateRoadmapProgress(skill, nextCompleted);
      if (onMilestoneToggled) {
        onMilestoneToggled(skill, nextCompleted);
      }
    } catch (err) {
      // Revert on error
      setOverrides((prev) => ({
        ...prev,
        [skill]: currentlyDone
      }));
      setToggleError(err?.message || `Failed to update progress for ${skill}. Please try again.`);
    } finally {
      setUpdatingSkill(null);
    }
  };

  return (
    <section className="dashboard-section-card" id="roadmap-section" aria-label="Personalized Learning Roadmap">
      {/* Title Bar */}
      <div className="section-title-bar">
        <div>
          <h3>Personalized Learning Roadmap</h3>
          <p className="section-subtitle">
            Curated resources &amp; hands-on projects for <strong>{targetRole}</strong>
          </p>
        </div>
        <span className="count-pill">{recommendations.length} action milestones</span>
      </div>

      {/* Progress Tracking Bar */}
      <div className="roadmap-progress-banner">
        <div className="progress-banner-text">
          <span className="progress-title">Learning Milestone Progress</span>
          <span className="progress-stats">
            <strong>{completedCount}</strong> of <strong>{totalItems}</strong> completed ({progressPercent}%)
          </span>
        </div>
        <div className="progress-track" aria-label={`Milestones progress: ${progressPercent}%`}>
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {toggleError && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{toggleError}</span>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="roadmap-grid" role="list">
        {recommendations.map((rec) => {
          const priorityLower = (rec.priority || 'Medium').toLowerCase();
          const priorityClass = `priority-${priorityLower}`;
          const isDone = getIsCompleted(rec);
          const isUpdating = updatingSkill === rec.skill;

          return (
            <div
              key={rec.skill}
              className={`roadmap-card ${priorityClass} ${isDone ? 'milestone-done' : ''}`}
              role="listitem"
            >
              <div className="roadmap-card-header">
                <div className="roadmap-header-left">
                  <h4 className="roadmap-skill-title">{rec.skill}</h4>
                  <span className={`priority-badge ${priorityClass}`}>
                    {rec.priority} Priority
                  </span>
                  {isDone && <span className="completed-badge">✓ Completed</span>}
                </div>
                <div className="roadmap-gap-badge">
                  Gap: <strong>+{rec.gap}</strong>
                </div>
              </div>

              {/* Proficiency status */}
              <div className="roadmap-meta-row">
                <span>
                  Current: <strong>L{rec.currentProficiency}</strong> ({getProficiencyLabel(rec.currentProficiency)})
                </span>
                <span className="meta-divider">&bull;</span>
                <span>
                  Target: <strong>L{rec.requiredProficiency}</strong> ({getProficiencyLabel(rec.requiredProficiency)})
                </span>
              </div>

              {/* Recommended Learning Topic */}
              <div className="roadmap-detail-block">
                <span className="detail-heading">📖 Recommended Learning Topic</span>
                <p className="detail-content">{rec.learningTopic}</p>
              </div>

              {/* Recommended Project Idea */}
              <div className="roadmap-detail-block project-block">
                <span className="detail-heading">💡 Recommended Project Idea</span>
                <p className="detail-content">{rec.projectIdea}</p>
              </div>

              {/* Action Buttons: Milestone Checkbox Toggle + Resource Link */}
              <div className="roadmap-action-row">
                {rec.resourceUrl ? (
                  <a
                    href={rec.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-resource-link"
                  >
                    <span>Open Resource</span>
                    <span className="external-arrow" aria-hidden="true">
                      &nearr;
                    </span>
                  </a>
                ) : (
                  <span className="no-resource-text">Resource link unavailable</span>
                )}

                {/* Milestone Completion Toggle */}
                <button
                  type="button"
                  className={`btn-toggle-milestone ${isDone ? 'done' : ''}`}
                  disabled={isUpdating}
                  onClick={() => handleToggle(rec.skill, isDone)}
                  title={isDone ? 'Mark milestone as incomplete' : 'Mark milestone as completed'}
                >
                  {isUpdating ? (
                    <span className="btn-spinner-sm"></span>
                  ) : isDone ? (
                    <>
                      <span className="toggle-check">✓</span>
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <span className="toggle-circle">○</span>
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RoadmapSection;
