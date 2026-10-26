import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchSkills } from '../services/skillService';
import { fetchCareerGoal } from '../services/careerGoalService';
import { fetchSkillGaps } from '../services/skillService';
import { fetchRoadmap } from '../services/roadmapService';
import { SKILL_CATEGORIES } from '../config/skillCatalog';
import SkillForm from './SkillForm';
import SkillItem from './SkillItem';
import CareerGoalSection from './CareerGoalSection';
import SkillGapSection from './SkillGapSection';
import RoadmapSection from './RoadmapSection';
import CareerReadinessCard from './CareerReadinessCard';
import SkillSelectionModal from './SkillSelectionModal';

export function DashboardPage() {
  const { user } = useAuth();

  // 1. Profile & Career Goal state
  const [targetRole, setTargetRole] = useState(null);

  // 2. Skills state
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState(null);

  // User Skills Search & Category Filter state
  const [skillSearch, setSkillSearch] = useState('');
  const [skillCategory, setSkillCategory] = useState('all');

  // 3. Skill Gap Analysis state
  const [gapData, setGapData] = useState(null);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [gapsError, setGapsError] = useState(null);

  // 4. Learning Roadmap state
  const [roadmapData, setRoadmapData] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  // 5. Skill Catalog Modal state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Map skill names to categories for user skill filtering
  const skillCategoryLookup = useMemo(() => {
    const map = new Map();
    SKILL_CATEGORIES.forEach((cat) => {
      cat.skills.forEach((s) => {
        map.set(s.toLowerCase(), { id: cat.id, name: cat.name });
      });
    });
    return map;
  }, []);

  // Filter user skills based on search query and category
  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    return skills.filter((s) => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query);
      if (!matchesQuery) return false;

      if (skillCategory === 'all') return true;

      const catInfo = skillCategoryLookup.get(s.name.toLowerCase());
      const catId = catInfo ? catInfo.id : 'custom';
      return catId === skillCategory;
    });
  }, [skills, skillSearch, skillCategory, skillCategoryLookup]);

  // Derive which categories exist among user's current skills
  const availableUserCategories = useMemo(() => {
    const catMap = new Map();
    skills.forEach((s) => {
      const catInfo = skillCategoryLookup.get(s.name.toLowerCase());
      if (catInfo) {
        catMap.set(catInfo.id, catInfo.name);
      } else {
        catMap.set('custom', 'Custom Skills');
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [skills, skillCategoryLookup]);

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

  // Initial load: Profile, Target Role, and Skills in parallel
  useEffect(() => {
    let isMounted = true;

    async function loadInitialDashboard() {
      setLoadingSkills(true);

      const [skillsResult, goalResult] = await Promise.allSettled([
        fetchSkills(),
        fetchCareerGoal()
      ]);

      if (!isMounted) return;

      let currentGoalRole = null;

      // Handle Career Goal
      if (goalResult.status === 'fulfilled' && goalResult.value) {
        currentGoalRole = goalResult.value.targetRole || null;
        setTargetRole(currentGoalRole);
      } else {
        setTargetRole(null);
      }

      // Handle Skills
      if (skillsResult.status === 'fulfilled') {
        setSkills(skillsResult.value || []);
      } else {
        setSkillsError(skillsResult.reason?.message || 'Failed to load skills.');
      }
      setLoadingSkills(false);

      // Trigger Gaps & Roadmap if career goal exists
      if (currentGoalRole) {
        await refreshAnalysisAndRoadmap(currentGoalRole);
      }
    }

    loadInitialDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshAnalysisAndRoadmap]);

  // Handler: Career goal saved
  const handleGoalSaved = async (newRole) => {
    setTargetRole(newRole);
    await refreshAnalysisAndRoadmap(newRole);
  };

  // Handler: Single Skill added
  const handleSkillAdded = async (newSkill) => {
    setSkills((prev) => {
      const filtered = prev.filter(
        (s) => s.name.toLowerCase() !== newSkill.name.toLowerCase()
      );
      return [newSkill, ...filtered];
    });

    if (targetRole) {
      await refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Batch Skills added from catalog modal
  const handleBatchSkillsAdded = async (updatedSkills) => {
    if (Array.isArray(updatedSkills)) {
      setSkills(updatedSkills);
    } else {
      // Re-fetch all
      const latest = await fetchSkills();
      setSkills(latest);
    }

    if (targetRole) {
      await refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Skill updated
  const handleSkillUpdated = async (updatedSkill) => {
    setSkills((prev) =>
      prev.map((s) => (s._id === updatedSkill._id ? updatedSkill : s))
    );

    if (targetRole) {
      await refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Skill deleted
  const handleSkillDeleted = async (deletedId) => {
    setSkills((prev) => prev.filter((s) => s._id !== deletedId));

    if (targetRole) {
      await refreshAnalysisAndRoadmap(targetRole);
    }
  };

  // Handler: Milestone progress toggled in Roadmap
  const handleMilestoneToggled = (skill, completed) => {
    setRoadmapData((prev) => {
      if (!prev || !prev.recommendations) return prev;
      const updatedRecs = prev.recommendations.map((rec) =>
        rec.skill === skill ? { ...rec, isCompleted: completed } : rec
      );
      const completedCount = updatedRecs.filter((r) => r.isCompleted).length;
      const progressPercentage =
        updatedRecs.length > 0
          ? Math.round((completedCount / updatedRecs.length) * 100)
          : 0;

      return {
        ...prev,
        recommendations: updatedRecs,
        summary: {
          ...prev.summary,
          completedMilestonesCount: completedCount,
          progressPercentage
        }
      };
    });
  };

  // Smooth scroll helpers
  const handleScrollToCareerGoal = () => {
    const el = document.getElementById('career-goal-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSkills = () => {
    const el = document.getElementById('skills-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToRoadmap = () => {
    const el = document.getElementById('roadmap-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Dashboard Welcome & Overview Bar */}
      <section className="dashboard-welcome-banner" aria-label="Dashboard Overview">
        <div className="welcome-content">
          <div className="welcome-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="welcome-text">
            <h2>Welcome, {user?.name || 'Engineer'}</h2>
            <p>
              Your career development dashboard &bull; Track proficiencies, analyze skill gaps, and complete milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts Bar */}
      <section className="dashboard-quick-actions" aria-label="Dashboard Quick Navigation">
        <button
          type="button"
          className="quick-action-pill"
          onClick={handleScrollToCareerGoal}
        >
          <span className="pill-icon">🎯</span>
          <span>{targetRole ? `Goal: ${targetRole}` : 'Choose Career Goal'}</span>
        </button>
        <button
          type="button"
          className="quick-action-pill"
          onClick={() => setIsLibraryOpen(true)}
        >
          <span className="pill-icon">📚</span>
          <span>Skill Library</span>
        </button>
        <button
          type="button"
          className="quick-action-pill"
          onClick={handleScrollToSkills}
        >
          <span className="pill-icon">⚡</span>
          <span>Tracked Skills ({skills.length})</span>
        </button>
        {targetRole && (
          <button
            type="button"
            className="quick-action-pill"
            onClick={handleScrollToRoadmap}
          >
            <span className="pill-icon">🗺️</span>
            <span>View Roadmap</span>
          </button>
        )}
      </section>

      {/* 2. Career Readiness Overview Card (Part C) */}
      <CareerReadinessCard
        targetRole={targetRole}
        gapData={gapData}
        onScrollToRoadmap={handleScrollToRoadmap}
      />

      {/* 3. Career Goal Selection */}
      <CareerGoalSection
        key={targetRole || 'no-goal'}
        currentRole={targetRole}
        onGoalSaved={handleGoalSaved}
      />

      {/* 4. Skills Management (Searchable Library, Inline Editing & Category Filtering) */}
      <section className="skills-section" id="skills-section" aria-label="Skills Management">
        <div className="section-header-row">
          <div className="section-title-group">
            <h3>My Skills Profile</h3>
            <p className="section-subtitle">
              Manage your verified competencies, inline proficiency ratings, and category filters.
            </p>
          </div>
          <span className="count-pill">{skills.length} skills tracked</span>
        </div>

        {/* Skill Form & Library Trigger */}
        <SkillForm
          onSkillAdded={handleSkillAdded}
          onOpenLibrary={() => setIsLibraryOpen(true)}
        />

        {/* User Skills Search & Category Filter Bar */}
        {skills.length > 0 && (
          <div className="user-skills-filter-card">
            <div className="filter-input-wrapper">
              <span className="filter-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="user-skills-search-input"
                placeholder="Search your skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                aria-label="Search your added skills"
              />
              {skillSearch && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setSkillSearch('')}
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            {availableUserCategories.length > 1 && (
              <div className="user-skills-category-chips" role="radiogroup" aria-label="Filter by category">
                <button
                  type="button"
                  className={`category-filter-chip ${skillCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSkillCategory('all')}
                >
                  All ({skills.length})
                </button>
                {availableUserCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-filter-chip ${skillCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSkillCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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

        {/* Empty State when no skills exist at all */}
        {!loadingSkills && !skillsError && skills.length === 0 && (
          <div className="empty-skills-box">
            <div className="empty-icon">🎯</div>
            <h4>No skills added yet</h4>
            <p>Browse our curated library or add your custom competencies above to start your gap analysis.</p>
            <button
              type="button"
              className="btn-browse-library mt-3"
              onClick={() => setIsLibraryOpen(true)}
            >
              📚 Browse 100+ Skill Library
            </button>
          </div>
        )}

        {/* Filtered Empty State when search has no matches */}
        {!loadingSkills && skills.length > 0 && filteredSkills.length === 0 && (
          <div className="empty-filter-state">
            <p>No skills found matching &ldquo;{skillSearch}&rdquo;.</p>
            <button
              type="button"
              className="btn-action-sm btn-cancel mt-2"
              onClick={() => {
                setSkillSearch('');
                setSkillCategory('all');
              }}
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Skills List */}
        {!loadingSkills && filteredSkills.length > 0 && (
          <div className="skills-list" role="list">
            {filteredSkills.map((skill) => (
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

      {/* 5. Skill Gap Analysis */}
      <SkillGapSection
        gapData={gapData}
        loading={loadingGaps}
        error={gapsError}
        hasCareerGoal={Boolean(targetRole)}
        onRetry={() => refreshAnalysisAndRoadmap(targetRole)}
      />

      {/* 6. Personalized Learning Roadmap with Real Progress Tracking (Part D) */}
      <RoadmapSection
        roadmapData={roadmapData}
        loading={loadingRoadmap}
        error={roadmapError}
        hasCareerGoal={Boolean(targetRole)}
        onRetry={() => refreshAnalysisAndRoadmap(targetRole)}
        onMilestoneToggled={handleMilestoneToggled}
      />

      {/* 7. Searchable Skill Selection Modal (Part B) */}
      <SkillSelectionModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        existingSkills={skills}
        onSkillsAdded={handleBatchSkillsAdded}
      />
    </div>
  );
}

export default DashboardPage;
