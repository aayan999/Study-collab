import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './TaskBoard.css';

const TaskBoard = ({ groupId, groupMembers }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignee, setAssignee] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?group=${groupId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [groupId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, priority, group: groupId };
      if (assignee) payload.assignee = assignee;

      const res = await api.post('/tasks', payload);
      setTasks([res.data, ...tasks]);
      setShowTaskModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and Drop Logic
  const onDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('taskId', task._id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (draggedTask && draggedTask.status !== status) {
      // Optimistic update
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status } : t));
      
      try {
        await api.put(`/tasks/${taskId}`, { status });
      } catch (err) {
        console.error('Failed to update task status', err);
        fetchTasks(); // Revert on failure
      }
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'high': return 'var(--danger)';
      case 'low': return 'var(--success)';
      default: return 'var(--warning)';
    }
  };

  const renderColumn = (status, title) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div 
        className="task-column glass-panel"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="column-header">
          <h3>{title}</h3>
          <span className="task-count">{columnTasks.length}</span>
        </div>
        
        <div className="task-list">
          {columnTasks.map(task => (
            <div 
              key={task._id} 
              className="task-card"
              draggable
              onDragStart={(e) => onDragStart(e, task)}
            >
              <div className="task-priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
              <h4>{task.title}</h4>
              {task.description && <p>{task.description}</p>}
              
              <div className="task-meta">
                {task.assignee ? (
                  <img src={task.assignee.avatar} alt="Assignee" className="assignee-avatar" title={`Assigned to ${task.assignee.name}`} />
                ) : (
                  <div className="unassigned-avatar" title="Unassigned">?</div>
                )}
                
                <span className="task-date">{new Date(task.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          ))}
          
          {status === 'todo' && (
            <button className="add-task-inline" onClick={() => setShowTaskModal(true)}>
              + Add Task
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading board...</div>;

  return (
    <div className="task-board-container">
      <div className="board-header flex-between">
        <h2>Kanban Board</h2>
        <button className="btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
      </div>

      <div className="board-columns">
        {renderColumn('todo', 'To Do')}
        {renderColumn('inprogress', 'In Progress')}
        {renderColumn('done', 'Done')}
      </div>

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>New Task</h2>
              <button className="close-btn" onClick={() => setShowTaskModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="What needs to be done?"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows="2"
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Assign To</label>
                  <select value={assignee} onChange={e => setAssignee(e.target.value)}>
                    <option value="">Unassigned</option>
                    {groupMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
