import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export function LoginPage({ onNavigate, navigationState }) {
  const { login } = useAuth();

  const [email, setEmail] = useState(() => navigationState?.registeredEmail || '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage] = useState(() =>
    navigationState?.registeredEmail
      ? 'Account created! Please enter your password to sign in.'
      : null
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);

      // Clear password field immediately
      setPassword('');

      // Navigate to dashboard upon successful login
      onNavigate('/dashboard');
    } catch (err) {
      setError(
        err.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your SkillForge account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {infoMessage && (
          <div className="alert alert-success" role="status">
            <span className="alert-icon">✓</span>
            <span>{infoMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="login-email">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="auth-link"
          onClick={() => onNavigate('/register')}
          disabled={loading}
        >
          Create one now
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
