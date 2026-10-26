import { useMemo, useState } from 'react';
import { ROLE_METADATA } from '../services/careerGoalService';
import { getProficiencyLabel } from '../services/skillService';

export function CareerReadinessCard({ targetRole, gapData, onScrollToRoadmap }) {
  const [showFormula, setShowFormula] = useState(false);

  const readinessStats = useMemo(() => {
    if (!targetRole || !gapData || !Array.isArray(gapData.gaps) || gapData.gaps.length === 0) {
      return null;
    }

    const gaps = gapData.gaps;
    let totalRequiredProficiency = 0;
    let earnedProficiency = 0;
    let achievedCount = 0;
    let needsImprovementCount = 0;
    let missingCount = 0;
    let criticalCount = 0;
    let moderateCount = 0;
    let minorCount = 0;

    gaps.forEach((g) => {
      totalRequiredProficiency += g.requiredProficiency;
      earnedProficiency += Math.min(g.currentProficiency, g.requiredProficiency);

      if (g.gap === 0) {
        achievedCount++;
      } else if (g.currentProficiency > 0) {
        needsImprovementCount++;
      } else {
        missingCount++;
      }

      if (g.gap >= 3) {
        criticalCount++;
      } else if (g.gap === 2) {
        moderateCount++;
      } else if (g.gap === 1) {
        minorCount++;
      }
    });

    const percentage =
      gapData.readinessPercentage !== undefined
        ? gapData.readinessPercentage
        : totalRequiredProficiency > 0
        ? Math.round((earnedProficiency / totalRequiredProficiency) * 100)
        : 0;

    // Top priority actionable gaps (up to 3)
    const priorityGaps = gaps.filter((g) => g.gap > 0).slice(0, 3);
    const topGap = priorityGaps[0] || null;

    return {
      percentage,
      totalSkills: gaps.length,
      achievedCount: gapData.achievedSkillsCount ?? achievedCount,
      needsImprovementCount: gapData.skillsNeedingImprovementCount ?? needsImprovementCount,
      missingCount: gapData.missingSkillsCount ?? missingCount,
      earnedProficiency: gapData.totalEarnedPoints ?? earnedProficiency,
      totalRequiredProficiency: gapData.totalRequiredPoints ?? totalRequiredProficiency,
      criticalCount: gapData.criticalGapsCount ?? criticalCount,
      moderateCount: gapData.moderateGapsCount ?? moderateCount,
      minorCount: gapData.minorGapsCount ?? minorCount,
      priorityGaps,
      topGap,
      explanation:
        gapData.readinessExplanation ||
        `Readiness reflects earned competency points toward role benchmarks (${earnedProficiency} of ${totalRequiredProficiency} points, or ${percentage}%). Additional skills outside the role are preserved without penalty.`
    };
  }, [targetRole, gapData]);

  if (!targetRole) {
    return (
      <div className="career-readiness-card empty-readiness" aria-label="Career Readiness">
        <div className="readiness-empty-content">
          <div className="readiness-icon-circle">🎯</div>
          <div className="readiness-empty-text">
            <h3>Career Readiness Analyzer</h3>
            <p>
              Select a target career role to calculate your readiness score, compare proficiencies, and identify your highest-impact skill gaps.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const roleMeta = ROLE_METADATA[targetRole] || {
    category: 'Software Engineering',
    description: 'Technical career path'
  };

  const percentage = readinessStats?.percentage || 0;
  const topGap = readinessStats?.topGap;
  const priorityGaps = readinessStats?.priorityGaps || [];

  return (
    <section className="career-readiness-card" aria-label="Career Readiness Overview">
      {/* Top Banner: Target Role & Readiness Score */}
      <div className="readiness-header-row">
        <div className="readiness-role-info">
          <div className="role-category-tag">{roleMeta.category}</div>
          <h2 className="readiness-role-title">{targetRole}</h2>
          <p className="readiness-role-desc">{roleMeta.description}</p>
        </div>

        <div className="readiness-score-widget">
          <div className="score-circular-wrapper">
            <span className="score-number">{percentage}%</span>
            <span className="score-sub">
              {percentage >= 80 ? 'Role Ready' : percentage >= 50 ? 'In Progress' : 'Foundation'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="readiness-progress-track" aria-label={`Role readiness progress: ${percentage}%`}>
        <div
          className={`readiness-progress-fill ${
            percentage >= 80 ? 'high' : percentage >= 50 ? 'medium' : 'low'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Readiness Explanation & Transparency */}
      <div className="readiness-formula-row">
        <div className="formula-explanation-text">
          <span className="formula-badge">📊 Calculation Basis</span>
          <span className="formula-desc">
            {readinessStats?.explanation}
          </span>
        </div>
        <button
          type="button"
          className="btn-formula-toggle"
          onClick={() => setShowFormula((v) => !v)}
          aria-expanded={showFormula}
        >
          {showFormula ? 'Hide details' : 'How it works ▾'}
        </button>
      </div>

      {showFormula && (
        <div className="formula-details-box">
          <p>
            <strong>Transparent Scoring Engine:</strong> Each requirement has a benchmark level (1 to 5). You earn points up to the target level for each required skill:
          </p>
          <div className="formula-code-pill">
            Readiness % = (Earned Competency Points &divide; Total Target Points) &times; 100
          </div>
          <p className="formula-note">
            &bull; Skills outside this role remain in your profile and do not reduce your score.
            <br />
            &bull; Levels 1&ndash;5 represent a continuous spectrum: Beginner, Elementary, Intermediate, Advanced, and Expert.
          </p>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="readiness-kpi-grid">
        <div className="readiness-kpi-item">
          <span className="kpi-value text-blue">
            {readinessStats?.achievedCount || 0} / {readinessStats?.totalSkills || 0}
          </span>
          <span className="kpi-label">Skills Achieved</span>
        </div>
        <div className="readiness-kpi-item">
          <span className="kpi-value text-amber">{readinessStats?.needsImprovementCount || 0}</span>
          <span className="kpi-label">Underdeveloped</span>
        </div>
        <div className="readiness-kpi-item">
          <span className="kpi-value text-red">{readinessStats?.missingCount || 0}</span>
          <span className="kpi-label">Missing Skills</span>
        </div>
        <div className="readiness-kpi-item">
          <span className="kpi-value text-slate">
            {readinessStats?.earnedProficiency || 0} / {readinessStats?.totalRequiredProficiency || 0}
          </span>
          <span className="kpi-label">Competency Points</span>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      <div className="severity-summary-bar">
        <span className="severity-bar-label">Gap Severity:</span>
        <span className="severity-tag critical">
          High Impact (3+): <strong>{readinessStats?.criticalCount || 0}</strong>
        </span>
        <span className="severity-tag moderate">
          Medium Impact (2): <strong>{readinessStats?.moderateCount || 0}</strong>
        </span>
        <span className="severity-tag minor">
          Low Impact (1): <strong>{readinessStats?.minorCount || 0}</strong>
        </span>
        <span className="severity-tag fulfilled">
          Fulfilled: <strong>{readinessStats?.achievedCount || 0}</strong>
        </span>
      </div>

      {/* Actionable Next Priority Recommendations */}
      <div className="readiness-action-banner">
        <div className="action-banner-icon">
          {topGap ? '🚀' : '🎉'}
        </div>
        <div className="action-banner-body">
          <div className="action-badge-row">
            <span className="action-badge">
              {topGap ? 'Highest-Impact Focus Areas' : 'Role Ready'}
            </span>
          </div>

          {readinessStats?.earnedProficiency === 0 && topGap ? (
            <p className="action-text">
              No matching skills logged yet for <strong>{targetRole}</strong>. Begin by adding your skills or exploring our library to start closing gaps.
            </p>
          ) : topGap ? (
            <div className="priority-gaps-list">
              <p className="action-text mb-2">
                Accelerate readiness by focusing on your highest-impact skill gaps:
              </p>
              <div className="priority-chips-row">
                {priorityGaps.map((gap) => (
                  <div key={gap.skill} className="priority-gap-chip">
                    <span className="chip-skill-name">{gap.skill}</span>
                    <span className={`chip-impact-tag ${gap.severity || 'moderate'}`}>
                      {gap.impact || `+${gap.gap} Gap`}
                    </span>
                    <span className="chip-level-range">
                      L{gap.currentProficiency} &rarr; L{gap.requiredProficiency} ({getProficiencyLabel(gap.requiredProficiency)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="action-text">
              Outstanding work! You meet all required competency thresholds for{' '}
              <strong>{targetRole}</strong>. Continue building advanced portfolio projects to demonstrate practical mastery.
            </p>
          )}
        </div>

        {topGap && onScrollToRoadmap && (
          <button
            type="button"
            className="btn-jump-roadmap"
            onClick={onScrollToRoadmap}
          >
            <span>View Roadmap</span>
            <span aria-hidden="true">&darr;</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default CareerReadinessCard;
