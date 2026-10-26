import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';

export function Navbar({ currentPath, onNavigate }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    onNavigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Account';

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

            {/* Profile Dropdown Trigger */}
            <div className="profile-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`profile-dropdown-trigger ${dropdownOpen ? 'open' : ''}`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User profile and account settings"
              >
                <span className="dropdown-avatar">{initial}</span>
                <span className="dropdown-username">{firstName}</span>
                <span className={`dropdown-chevron ${dropdownOpen ? 'rotated' : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="profile-dropdown-menu" role="menu" aria-label="User Account Menu">
                  {/* User Profile Summary */}
                  <div className="dropdown-user-header">
                    <div className="dropdown-header-avatar">{initial}</div>
                    <div className="dropdown-user-details">
                      <div className="dropdown-fullname">{user?.name || 'Engineer'}</div>
                      <div className="dropdown-email">{user?.email || 'authenticated@skillforge.io'}</div>
                    </div>
                  </div>

                  <hr className="dropdown-divider" />

                  {/* Account Actions */}
                  <div className="dropdown-menu-list">
                    <button
                      type="button"
                      className="dropdown-menu-item item-signout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span className="menu-item-icon" aria-hidden="true">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
