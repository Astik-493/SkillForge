import { useAuth } from '../context/useAuth';

export function Navbar({ currentPath, onNavigate }) {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <nav className="top-navbar" aria-label="Main Navigation">
      <button
        type="button"
        className="nav-brand"
        onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/login')}
      >
        <div className="nav-brand-logo">SF</div>
        <span className="nav-brand-title">SkillForge</span>
      </button>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className={`nav-btn ${currentPath === '/dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className="nav-btn nav-btn-primary"
              onClick={handleLogout}
            >
              Sign Out ({user?.name ? user.name.split(' ')[0] : 'User'})
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`nav-btn ${currentPath === '/login' ? 'active' : ''}`}
              onClick={() => onNavigate('/login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`nav-btn nav-btn-primary ${currentPath === '/register' ? 'active' : ''}`}
              onClick={() => onNavigate('/register')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
