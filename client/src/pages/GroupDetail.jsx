import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ChatPanel from '../components/ChatPanel';
import NotesPanel from '../components/NotesPanel';
import TaskBoard from '../components/TaskBoard';
import './GroupDetail.css';

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) return <div className="loading-state">Loading group details...</div>;
  if (!group) return <div className="error-state">Group not found.</div>;

  return (
    <div className="group-detail-container">
      <div className="group-main-content">
        <header className="group-header glass-panel">
          <div className="brand-stripe" style={{ backgroundColor: group.color }}></div>
          <div className="header-inner">
            <Link to="/groups" className="back-link">← Back to Groups</Link>
            <div className="header-title-row">
              <div>
                <span className="group-subject-tag">{group.subject}</span>
                <h1>{group.name}</h1>
              </div>
              <div className="group-members-faces">
                {group.members.slice(0, 5).map((m, i) => (
                  <img key={m._id} src={m.avatar} alt={m.name} title={m.name} style={{ zIndex: 5 - i }} />
                ))}
                <span className="total-count">{group.members.length} members</span>
              </div>
            </div>
            <p className="group-desc">{group.description}</p>
          </div>
        </header>

        <div className="group-tabs">
          <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
            📝 Notes & Files
          </button>
          <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
            📋 Task Board
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'notes' ? (
            <NotesPanel groupId={id} />
          ) : (
            <TaskBoard groupId={id} groupMembers={group.members} />
          )}
        </div>
      </div>

      <div className="group-sidebar">
        <ChatPanel groupId={id} />
      </div>
    </div>
  );
};

export default GroupDetail;
