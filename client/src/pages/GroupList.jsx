import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Groups.css';

const GroupList = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [exploreGroups, setExploreGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('my-groups');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('General');
  const [description, setDescription] = useState('');
  
  const fetchMyGroups = async () => {
    try {
      const res = await api.get('/groups');
      setMyGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExploreGroups = async () => {
    try {
      const res = await api.get('/groups/explore');
      setExploreGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'my-groups') {
      fetchMyGroups().finally(() => setLoading(false));
    } else {
      fetchExploreGroups().finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/groups', { name, description, subject });
      setMyGroups([res.data, ...myGroups]);
      setShowCreateModal(false);
      setName('');
      setDescription('');
      setActiveTab('my-groups');
    } catch (err) {
      console.error('Failed to create group', err);
    }
  };

  const handleJoinGroup = async (id) => {
    try {
      await api.post(`/groups/${id}/join`);
      fetchExploreGroups(); // Refresh list to show joined status
    } catch (err) {
      console.error('Failed to join group', err);
    }
  };

  return (
    <div className="groups-page">
      <header className="page-header flex-between">
        <div>
          <h1>Study Groups 📚</h1>
          <p className="subtitle">Collaborate, share notes, and learn together.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create Group
        </button>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'my-groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-groups')}
        >
          My Groups
        </button>
        <button 
          className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          Explore
        </button>
      </div>

      <div className="groups-content">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <div className="group-grid">
            {(activeTab === 'my-groups' ? myGroups : exploreGroups).map((group) => (
              <div key={group._id} className="group-card glass-panel">
                <div className="group-color-bar" style={{ backgroundColor: group.color }}></div>
                <div className="group-card-content">
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="group-subject">{group.subject}</span>
                    <span className="member-count">{group.members.length} members</span>
                  </div>
                  
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-description">{group.description || 'No description provided.'}</p>
                  
                  <div className="group-footer flex-between" style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                    <div className="members-avatars">
                      {group.members.slice(0, 3).map((member, i) => (
                        <img 
                          key={member._id} 
                          src={member.avatar} 
                          alt={member.name} 
                          className="member-avatar-small"
                          style={{ zIndex: 3 - i, transform: `translateX(-${i * 10}px)` }}
                        />
                      ))}
                    </div>

                    {activeTab === 'my-groups' ? (
                      <Link to={`/groups/${group._id}`} className="btn-primary-small">
                        Enter
                      </Link>
                    ) : (
                      <button 
                        className="btn-outline-small"
                        onClick={() => handleJoinGroup(group._id)}
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Create a Study Group</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="modal-form">
              <div className="form-group">
                <label>Group Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. CS101 Study Buddy"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Literature">Literature</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="What is this group about?"
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList;
