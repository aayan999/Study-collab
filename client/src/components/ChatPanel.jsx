import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ChatPanel.css';

const ChatPanel = ({ groupId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch chat history
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages?group=${groupId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };
    fetchHistory();

    // Setup Socket.IO
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinGroup', groupId);

    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.emit('leaveGroup', groupId);
      newSocket.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('sendMessage', {
      content: newMessage,
      groupId,
      senderId: user._id,
    });

    setNewMessage('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>💬 Live Chat</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, i) => {
          const isMine = msg.sender._id === user._id;
          const showAvatar = i === 0 || messages[i - 1].sender._id !== msg.sender._id;

          return (
            <div key={msg._id || i} className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && showAvatar && (
                <img src={msg.sender.avatar} alt={msg.sender.name} className="message-avatar" title={msg.sender.name} />
              )}
              {!isMine && !showAvatar && <div className="avatar-spacer"></div>}
              
              <div className={`message-bubble ${isMine ? 'bg-primary' : 'bg-secondary'}`}>
                {!isMine && showAvatar && <span className="sender-name">{msg.sender.name}</span>}
                <p>{msg.content}</p>
                <span className="timestamp">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
