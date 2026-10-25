import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { fetchSkills } from '../services/skillService';
import { fetchCareerGoal } from '../services/careerGoalService';
import SkillForm from './SkillForm';
import SkillItem from './SkillItem';

export function DashboardPage() {
  const { user } = useAuth();

  const [skills, setSkills] = useState([]);
  const [targetRole, setTargetRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's skills and career goal on mount
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setError(null);

      try {
        const [skillsData, careerGoalData] = await Promise.allSettled([
          fetchSkills(),
          fetchCareerGoal()
        ]);

        if (!isMounted) return;

        if (skillsData.status === 'fulfilled') {
          setSkills(skillsData.value || []);
        } else {
          setError(
            skillsData.reason?.message || 'Unable to load skills from server.'
          );
        }

        if (careerGoalData.status === 'fulfilled' && careerGoalData.value) {
          setTargetRole(careerGoalData.value.targetRole || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading dashboard data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSkillAdded = (newSkill) => {
    setSkills((prev) => {
      // If skill already exists (case-insensitive), update it; otherwise add to top
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
  };

  const handleSkillUpdated = (updatedSkill) => {
    setSkills((prev) =>
      prev.map((s) => (s._id === updatedSkill._id ? updatedSkill : s))
    );
  };

  const handleSkillDeleted = (deletedId) => {
    setSkills((prev) => prev.filter((s) => s._id !== deletedId));
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
      {/* 1. User Profile Overview */}
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
            <span className="role-value none">No target role selected yet</span>
          )}
        </div>
      </section>

      {/* 2. Skills Section */}
      <section className="skills-section" aria-label="Skills Management">
        <div className="section-header-row">
          <h3>My Skills</h3>
          <span className="count-pill">{skills.length} tracked</span>
        </div>

        {/* Add Skill Form */}
        <SkillForm onSkillAdded={handleSkillAdded} />

        {/* Loading State */}
        {loading && (
          <div className="status-box loading">
            <div className="spinner"></div>
            <p>Loading your skills...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && skills.length === 0 && (
          <div className="empty-skills-box">
            <div className="empty-icon">🎯</div>
            <h4>No skills added yet</h4>
            <p>Add your first skill above to begin tracking your proficiencies.</p>
          </div>
        )}

        {/* Skills List */}
        {!loading && skills.length > 0 && (
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
    </div>
  );
}

export default DashboardPage;
