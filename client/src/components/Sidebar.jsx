import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <div className={`sidebar glass-panel ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>🎓 StudyCollab</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item" onClick={closeMobile}>🏠 Dashboard</Link>
          <Link to="/groups" className="nav-item" onClick={closeMobile}>📚 Study Groups</Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <img src={user.avatar} alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
