import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user.name.split(' ')[0]} 👋</h1>
          <p className="subtitle">Here's what's happening in your study groups.</p>
        </div>
        <Link to="/groups" className="btn-primary">Browse Groups</Link>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-header flex-between">
            <h2>Your Study Groups</h2>
            {groups.length > 0 && <Link to="/groups" className="view-all">View All</Link>}
          </div>

          {loading ? (
            <div className="loading-state">Loading your groups...</div>
          ) : groups.length === 0 ? (
            <div className="empty-state glass-panel">
              <div className="icon">📚</div>
              <h3>No groups yet</h3>
              <p>Join or create a study group to start collaborating.</p>
              <Link to="/groups" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                Find a Group
              </Link>
            </div>
          ) : (
            <div className="group-grid">
              {groups.slice(0, 4).map((group) => (
                <Link to={`/groups/${group._id}`} key={group._id} className="group-card glass-panel group-link">
                  <div className="group-color-bar" style={{ backgroundColor: group.color }}></div>
                  <div className="group-card-content">
                    <span className="group-subject">{group.subject}</span>
                    <h3 className="group-name">{group.name}</h3>
                    <div className="group-meta">
                      <div className="members-avatars">
                        {group.members.slice(0, 3).map((member, i) => (
                          <img 
                            key={member._id} 
                            src={member.avatar} 
                            alt={member.name} 
                            className="member-avatar-small"
                            style={{ zIndex: 3 - i, transform: `translateX(-${i * 10}px)` }}
                            title={member.name}
                          />
                        ))}
                        {group.members.length > 3 && (
                          <div className="member-avatar-small more" style={{ transform: `translateX(-30px)` }}>
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="member-count">{group.members.length} members</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="dashboard-grid-2">
          <section className="dashboard-section glass-panel">
            <h2>Recent Activity</h2>
            <div className="empty-state-small">
              <p>Activity feed will appear here as your groups get active.</p>
            </div>
          </section>

          <section className="dashboard-section glass-panel">
            <h2>Upcoming Tasks</h2>
            <div className="empty-state-small">
              <p>Your pending tasks from all groups will show here.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
