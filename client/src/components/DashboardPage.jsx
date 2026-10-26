import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchSkills } from '../services/skillService';
import { fetchCareerGoal } from '../services/careerGoalService';
import { fetchSkillGaps } from '../services/skillService';
import { fetchRoadmap } from '../services/roadmapService';
import SkillForm from './SkillForm';
import SkillItem from './SkillItem';
import CareerGoalSection from './CareerGoalSection';
import SkillGapSection from './SkillGapSection';
import RoadmapSection from './RoadmapSection';

export function DashboardPage() {
  const { user } = useAuth();

  // 1. Profile & Career Goal state
  const [targetRole, setTargetRole] = useState(null);

  // 2. Skills state
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState(null);

  // 3. Skill Gap Analysis state
  const [gapData, setGapData] = useState(null);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [gapsError, setGapsError] = useState(null);

  // 4. Learning Roadmap state
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  // Helper to refresh Gaps and Roadmap when goal exists
  const refreshAnalysisAndRoadmap = useCallback(async (currentGoal) => {
    if (!currentGoal) {
      setGapData(null);
      setRoadmapData(null);
      return;
    }

    setLoadingGaps(true);
    setLoadingRoadmap(true);
    setGapsError(null);
    setRoadmapError(null);

    const [gapsResult, roadmapResult] = await Promise.allSettled([
      fetchSkillGaps(),
      fetchRoadmap()
    ]);

    if (gapsResult.status === 'fulfilled') {
      setGapData(gapsResult.value);
    } else {
      setGapsError(gapsResult.reason?.message || 'Failed to load skill gaps.');
    }
    setLoadingGaps(false);

    if (roadmapResult.status === 'fulfilled') {
      setRoadmapData(roadmapResult.value);
    } else {
      setRoadmapError(roadmapResult.reason?.message || 'Failed to load learning roadmap.');
    }
    setLoadingRoadmap(false);
  }, []);

  // Initial dashboard load
  useEffect(() => {
    let isMounted = true;

    async function initializeDashboard() {
      setLoadingSkills(true);
      setSkillsError(null);

      try {
        const [skillsRes, goalRes] = await Promise.allSettled([
          fetchSkills(),
          fetchCareerGoal()
        ]);

        if (!isMounted) return;

        let activeGoal = null;
        if (goalRes.status === 'fulfilled' && goalRes.value) {
          activeGoal = goalRes.value.targetRole || null;
          setTargetRole(activeGoal);
        }

        if (skillsRes.status === 'fulfilled') {
          setSkills(skillsRes.value || []);
        } else {
          setSkillsError(skillsRes.reason?.message || 'Failed to load skills.');
        }
        setLoadingSkills(false);

        // If goal exists, fetch gaps and roadmap
        if (activeGoal) {
          refreshAnalysisAndRoadmap(activeGoal);
        }
      } catch (err) {
        if (isMounted) {
          setSkillsError(err.message || 'Error initializing dashboard.');
          setLoadingSkills(false);
        }
      }
    }

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshAnalysisAndRoadmap]);

  // Handler: Goal Saved / Updated
  const handleGoalSaved = (newRole) => {
    setTargetRole(newRole);
    refreshAnalysisAndRoadmap(newRole);
  };

  // Handler: Skill Added -> update list & refresh gaps/roadmap
  const handleSkillAdded = (newSkill) => {
    setSkills((prev) => {
      const existingIdx = prev.findIndex(
        (s) => s.name.toLowerCase() === newSkill.name.toLowerCase()
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = newSkill;
        return updated;
      }
      return [newSkill, ...prev];
    });

    if (targetRole) {
      refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Skill Updated -> update list & refresh gaps/roadmap
  const handleSkillUpdated = (updatedSkill) => {
    setSkills((prev) =>
      prev.map((s) => (s._id === updatedSkill._id ? updatedSkill : s))
    );

    if (targetRole) {
      refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Skill Deleted -> update list & refresh gaps/roadmap
  const handleSkillDeleted = (deletedId) => {
    setSkills((prev) => prev.filter((s) => s._id !== deletedId));

    if (targetRole) {
      refreshAnalysisAndRoadmap(targetRole);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
    : 'U';

  return (
    <div className="dashboard-container">
      {/* 1. Profile Overview */}
      <section className="profile-overview-card" aria-label="User Profile">
        <div className="profile-main">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-details">
            <h2>{user?.name || 'SkillForge User'}</h2>
            <p className="profile-email">{user?.email || 'Authenticated User'}</p>
          </div>
        </div>

        <div className="profile-role-badge">
          <span className="role-label">Target Role</span>
          {targetRole ? (
            <span className="role-value">{targetRole}</span>
          ) : (
            <span className="role-value none">No career goal selected yet</span>
          )}
        </div>
      </section>

      {/* 2. Career Goal Selection */}
      <CareerGoalSection
        key={targetRole || 'no-goal'}
        currentRole={targetRole}
        onGoalSaved={handleGoalSaved}
      />

      {/* 3. My Skills (CRUD) */}
      <section className="skills-section" aria-label="Skills Management">
        <div className="section-header-row">
          <h3>My Skills</h3>
          <span className="count-pill">{skills.length} tracked</span>
        </div>

        {/* Add Skill Form */}
        <SkillForm onSkillAdded={handleSkillAdded} />

        {/* Loading State */}
        {loadingSkills && (
          <div className="status-box loading">
            <div className="spinner"></div>
            <p>Loading your skills...</p>
          </div>
        )}

        {/* Error State */}
        {!loadingSkills && skillsError && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{skillsError}</span>
          </div>
        )}

        {/* Empty State */}
        {!loadingSkills && !skillsError && skills.length === 0 && (
          <div className="empty-skills-box">
            <div className="empty-icon">🎯</div>
            <h4>No skills added yet</h4>
            <p>Add your first skill above to begin tracking your proficiencies.</p>
          </div>
        )}

        {/* Skills List */}
        {!loadingSkills && skills.length > 0 && (
          <div className="skills-list" role="list">
            {skills.map((skill) => (
              <SkillItem
                key={skill._id}
                skill={skill}
                onSkillUpdated={handleSkillUpdated}
                onSkillDeleted={handleSkillDeleted}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Skill Gap Analysis */}
      <SkillGapSection
        gapData={gapData}
        loading={loadingGaps}
        error={gapsError}
        hasCareerGoal={Boolean(targetRole)}
        onRetry={() => refreshAnalysisAndRoadmap(targetRole)}
      />

      {/* 5. Personalized Learning Roadmap */}
      <RoadmapSection
        roadmapData={roadmapData}
        loading={loadingRoadmap}
        error={roadmapError}
        hasCareerGoal={Boolean(targetRole)}
        onRetry={() => refreshAnalysisAndRoadmap(targetRole)}
      />
    </div>
  );
}

export default DashboardPage;
