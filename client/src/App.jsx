import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import './App.css';
import './styles/auth.css';

function AppShell() {
  const { isAuthenticated, loading } = useAuth();

  // Initialize path from browser URL, defaulting to /login or /dashboard
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    if (path === '/register') return '/register';
    if (path === '/dashboard') return '/dashboard';
    return '/login';
  });

  const [navigationState, setNavigationState] = useState(null);

  // Navigate helper that updates state and pushState for browser history
  const navigate = (path, state = null) => {
    setCurrentPath(path);
    setNavigationState(state);
    if (window.location.pathname !== path) {
      window.history.pushState(state, '', path);
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (['/login', '/register', '/dashboard'].includes(path)) {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute active page with route protection
  const activePath = (() => {
    if (loading) return currentPath;
    if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
      return '/dashboard';
    }
    if (!isAuthenticated && currentPath === '/dashboard') {
      return '/login';
    }
    return currentPath;
  })();

  return (
    <>
      <Navbar currentPath={activePath} onNavigate={navigate} />

      <div className="app-container">
        <header className="app-header">
          <span className="env-badge">Milestone 14A</span>
          <h1>SkillForge</h1>
          <p className="subtitle">Student Skill Gap Engine &amp; Learning Roadmap</p>
        </header>

        <main className="content-area">
          {loading ? (
            <div className="status-box loading">
              <div className="spinner"></div>
              <p>Loading SkillForge...</p>
            </div>
          ) : (
            <>
              {activePath === '/register' && <RegisterPage onNavigate={navigate} />}
              {activePath === '/login' && (
                <LoginPage onNavigate={navigate} navigationState={navigationState} />
              )}
              {activePath === '/dashboard' && <DashboardPage onNavigate={navigate} />}
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>SkillForge &bull; Client Authentication &amp; Dashboard Session</p>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
