import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left: Branding Panel */}
      <div className="auth-branding">
        <div className="brand-logo">
          📚 Study<span>Collab</span>
        </div>
        <div className="brand-headline">
          <h2>Your study group,<br />reimagined</h2>
          <p>Collaborate in real-time with your peers. Share notes, manage tasks, and chat — all in one place.</p>
        </div>
        <div className="brand-features">
          <div className="brand-feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-text">
              <strong>Real-Time Chat</strong>
              <span>Instant messaging with your group</span>
            </div>
          </div>
          <div className="brand-feature-card">
            <div className="feature-icon">📝</div>
            <div className="feature-text">
              <strong>Shared Notes</strong>
              <span>Collaborate on study materials together</span>
            </div>
          </div>
          <div className="brand-feature-card">
            <div className="feature-icon">📋</div>
            <div className="feature-text">
              <strong>Task Boards</strong>
              <span>Track assignments and deadlines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/" className="auth-home-link">← Back to Home</Link>

          <div className="auth-header">
            <h1>Welcome Back 👋</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
