import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      {/* Background Grid */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">{'<>'}</span> 
            <span className="logo-text">StudyCollab</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#about">About</a>
          </div>
        </div>
        <div className="nav-right">
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/register" className="nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="badge">
          <span className="dot"></span> v1.0 — Now with Real-time Collaboration
        </div>
        <h1 className="hero-title">
          Evolve your study group<br />
          <span className="gradient-text">with AI precision.</span>
        </h1>
        <p className="hero-subtitle">
          StudyCollab unifies your workflow. Form groups, share notes, manage<br/>
          Kanban tasks, and chat in real-time — all from a beautiful web interface.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-glow">Get Started Free &rarr;</Link>
          <a href="#features" className="btn-outline">See How It Works</a>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">FEATURES</span>
          <h2 className="section-title">
            Everything you need to<br/>
            <span className="gradient-text-alt">collaborate effectively</span>
          </h2>
          <p className="section-subtitle">
            Built for students who refuse to settle for outdated tools. Every<br/>
            feature designed around speed, focus, and intelligence.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Sync</h3>
            <p>Uses Socket.IO for sub-second live chat and immediate status updates — 100x faster than traditional polling approaches.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Smart Organization</h3>
            <p>Kanban boards and rich-text notes keep your study groups perfectly organized. Zero wasted time searching for materials.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure & Private</h3>
            <p>Every group is protected with JWT authentication. Share files and notes in a completely private sandbox environment.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🐳</div>
            <h3>Cloud Ready</h3>
            <p>Run validation in an isolated environment for production safety, or use local node checks for blazing-fast dev cycles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Batch Processing</h3>
            <p>Create unlimited groups, scan all tasks, evolve every project — fully automated from creation to final submission.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Live Dashboard</h3>
            <p>Real-time progress tracking, animated stats, and detailed group activity reports — all from a beautiful web interface.</p>
          </div>
        </div>
      </section>

      {/* ABOUT / TECH STACK SECTION */}
      <section id="about" className="about-section">
        <div className="about-content">
          <span className="section-eyebrow">ABOUT STUDYCOLLAB</span>
          <h2 className="about-title">
            Built by students,<br/>
            for <span className="gradient-text-blue">students</span>
          </h2>
          <p>
            StudyCollab was created to solve a simple problem: managing university projects across WhatsApp, Google Docs, and Trello is tedious.
          </p>
          <p>
            Using React for precise UI rendering, Socket.IO for intelligent real-time communication, and Express-backed MongoDB storage, StudyCollab delivers a production-safe collaboration environment at unprecedented speed.
          </p>
          <div className="about-actions">
            <Link to="/register" className="btn-glow-small">Start Collaborating &rarr;</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-outline-small">
              <span className="github-icon">⌨</span> GitHub
            </a>
          </div>
        </div>

        <div className="tech-stack-card">
          <div className="tech-stack-eyebrow">TECH STACK</div>
          <div className="tech-items">
            <div className="tech-item">
              <span className="tech-dot green"></span>
              <div className="tech-text">
                <h4>Vite + React</h4>
                <p>Ultra-fast JSX parsing & component rendering</p>
              </div>
            </div>
            <div className="tech-item">
              <span className="tech-dot blue"></span>
              <div className="tech-text">
                <h4>Socket.IO</h4>
                <p>Sub-ms latency WebSocket communication</p>
              </div>
            </div>
            <div className="tech-item">
              <span className="tech-dot cyan"></span>
              <div className="tech-text">
                <h4>Express + Node.js</h4>
                <p>Sandboxed API routing & authentication</p>
              </div>
            </div>
            <div className="tech-item">
              <span className="tech-dot purple"></span>
              <div className="tech-text">
                <h4>MongoDB</h4>
                <p>Live document storage & data persistence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bottom-cta">
        <h2>
          Ready to evolve?<br/>
          <span className="gradient-text">Start building with StudyCollab.</span>
        </h2>
        <p>
          Create a free account, join a group, and watch your productivity<br/>
          transform in minutes.
        </p>
        <div className="hero-actions justify-center">
          <Link to="/register" className="btn-glow">Get Started Free</Link>
          <Link to="/login" className="btn-outline">Log In</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <span className="logo-icon">{'<>'}</span> StudyCollab <span className="footer-muted">· Ultimate Collaboration Platform</span>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#about">About</a>
        </div>
        <div className="footer-right">
          &copy; 2026 StudyCollab. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
