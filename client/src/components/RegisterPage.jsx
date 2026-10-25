import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export function RegisterPage({ onNavigate }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Client-side quick validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await register(name.trim(), email.trim(), password);

      setSuccessMessage(
        response?.message || 'Registration successful! Directing you to login...'
      );

      // Clear password field immediately
      setPassword('');

      // Redirect user to login page after a brief delay so they see the success message
      setTimeout(() => {
        onNavigate('/login', { registeredEmail: email.trim() });
      }, 1200);
    } catch (err) {
      setError(
        err.message || 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join SkillForge to track skills and career roadmaps</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="status">
            <span className="alert-icon">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="register-name">
            Full Name
          </label>
          <input
            id="register-name"
            type="text"
            className="form-input"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">
            Email Address
          </label>
          <input
            id="register-email"
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
          <label className="form-label" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="form-input"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading || Boolean(successMessage)}
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              <span>Creating account...</span>
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <button
          type="button"
          className="auth-link"
          onClick={() => onNavigate('/login')}
          disabled={loading}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
