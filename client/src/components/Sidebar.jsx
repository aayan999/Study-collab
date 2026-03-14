import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2>🎓 StudyCollab</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className="nav-item">🏠 Dashboard</Link>
        <Link to="/groups" className="nav-item">📚 Study Groups</Link>
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
  );
};

export default Sidebar;
