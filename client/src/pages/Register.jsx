import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Weak' };
    if (score <= 3) return { level: 2, label: 'Medium' };
    return { level: 3, label: 'Strong' };
  }, [password]);

  const strengthClass = passwordStrength.level === 1 ? 'weak' : passwordStrength.level === 2 ? 'medium' : 'strong';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2>Start your<br />learning journey</h2>
          <p>Join thousands of students who study smarter, not harder. Create your free account in seconds.</p>
        </div>
        <div className="brand-features">
          <div className="brand-feature-card">
            <div className="feature-icon">🚀</div>
            <div className="feature-text">
              <strong>Instant Setup</strong>
              <span>Create a group and start in under a minute</span>
            </div>
          </div>
          <div className="brand-feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-text">
              <strong>Secure & Private</strong>
              <span>End-to-end encrypted study sessions</span>
            </div>
          </div>
          <div className="brand-feature-card">
            <div className="feature-icon">🌍</div>
            <div className="feature-text">
              <strong>100% Free</strong>
              <span>No credit card, no hidden fees, ever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/" className="auth-home-link">← Back to Home</Link>

          <div className="auth-header">
            <h1>Create Account 🚀</h1>
            <p>Join StudyCollab to connect with your peers</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Aayan Faras"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {password && (
                <>
                  <div className="password-strength">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`strength-bar ${i <= passwordStrength.level ? `active ${strengthClass}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className={`strength-label ${strengthClass}`}>
                    {passwordStrength.label}
                  </span>
                </>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
