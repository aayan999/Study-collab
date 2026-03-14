import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './NotesPanel.css';

const NotesPanel = ({ groupId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/notes?group=${groupId}`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [groupId]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notes', { title, content, group: groupId });
      setNotes([res.data, ...notes]);
      setShowEditor(false);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      if (selectedNote && selectedNote._id === id) setSelectedNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="notes-loading">Loading notes...</div>;

  return (
    <div className="notes-panel">
      <div className="notes-header flex-between">
        <h2>Shared Notes</h2>
        <button className="btn-primary" onClick={() => setShowEditor(!showEditor)}>
          {showEditor ? 'Cancel' : '+ New Note'}
        </button>
      </div>

      {showEditor && (
        <form className="note-editor glass-panel" onSubmit={handleCreateNote}>
          <input 
            type="text" 
            placeholder="Note Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required
            className="note-title-input"
          />
          <textarea 
            placeholder="Write your note here... (Markdown supported visually)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="note-content-input"
          ></textarea>
          <div className="editor-actions">
            <button type="submit" className="btn-primary">Save Note</button>
          </div>
        </form>
      )}

      <div className="notes-grid">
        {notes.length === 0 && !showEditor && (
          <div className="empty-state glass-panel" style={{ gridColumn: '1 / -1' }}>
            <p>No notes shared yet. Be the first to add one!</p>
          </div>
        )}

        {notes.map(note => (
          <div key={note._id} className="note-card glass-panel" onClick={() => setSelectedNote(note)}>
            <div className="note-card-header flex-between">
              <h3>{note.title}</h3>
              <button className="delete-note-btn" onClick={(e) => handleDelete(note._id, e)}>×</button>
            </div>
            <p className="note-preview">{note.content}</p>
            <div className="note-card-footer flex-between">
              <div className="note-author flex-center">
                <img src={note.author.avatar} alt={note.author.name} />
                <span>{note.author.name.split(' ')[0]}</span>
              </div>
              <span className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="note-modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="note-modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="note-modal-header flex-between">
              <h2>{selectedNote.title}</h2>
              <button className="close-btn" onClick={() => setSelectedNote(null)}>×</button>
            </div>
            <div className="note-modal-meta flex-between">
              <div className="note-author flex-center">
                <img src={selectedNote.author.avatar} alt={selectedNote.author.name} />
                <span>{selectedNote.author.name}</span>
              </div>
              <span className="note-date">
                {new Date(selectedNote.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="note-modal-body">
              {selectedNote.content}
            </div>
            <div className="note-modal-footer">
               <button className="btn-secondary" onClick={() => setSelectedNote(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
