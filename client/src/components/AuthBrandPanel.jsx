export function AuthBrandPanel() {
  return (
    <aside className="auth-brand-panel" aria-label="Platform Overview">
      <div className="brand-panel-content">
        <div className="brand-pill-tag">
          <span className="tag-sparkle">✦</span>
          <span>Career Development Platform</span>
        </div>

        <div className="brand-hero">
          <h2 className="brand-hero-title">Forge your path to top tech roles</h2>
          <p className="brand-hero-desc">
            Benchmark your competencies against verified industry standards, pinpoint high-impact skill gaps, and follow structured roadmaps.
          </p>
        </div>

        <div className="brand-features">
          <div className="brand-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon" role="img" aria-label="Target">🎯</span>
            </div>
            <div className="feature-text">
              <h4>Role-Based Benchmarking</h4>
              <p>Compare proficiencies against 11+ industry engineering profiles.</p>
            </div>
          </div>

          <div className="brand-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon" role="img" aria-label="Chart">📊</span>
            </div>
            <div className="feature-text">
              <h4>Precision Gap Engine</h4>
              <p>Uncover exact proficiency gaps with real-time readiness scoring.</p>
            </div>
          </div>

          <div className="brand-feature-item">
            <div className="feature-icon-wrapper">
              <span className="feature-icon" role="img" aria-label="Rocket">🚀</span>
            </div>
            <div className="feature-text">
              <h4>Progress-Tracked Roadmaps</h4>
              <p>Curated learning resources and hands-on portfolio projects.</p>
            </div>
          </div>
        </div>

        <div className="brand-panel-footer">
          <div className="trust-pill">
            <span className="trust-icon">★</span>
            <span>Portfolio-Ready Engineering Platform</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AuthBrandPanel;
