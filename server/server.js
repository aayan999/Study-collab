const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config({ path: '../.env' });

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const noteRoutes = require('./routes/notes');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => res.json({ message: 'StudyCollab API is running' }));

// Socket.IO
const Message = require('./models/Message');
const User = require('./models/User');

io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on('leaveGroup', (groupId) => {
    socket.leave(groupId);
    console.log(`User ${socket.id} left group ${groupId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { content, groupId, senderId } = data;
      const message = await Message.create({
        content,
        sender: senderId,
        group: groupId,
      });
      const populated = await Message.findById(message._id).populate('sender', 'name email avatar');
      io.to(groupId).emit('receiveMessage', populated);
    } catch (err) {
      console.error('Message error:', err.message);
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.groupId).emit('userTyping', { userName: data.userName });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.groupId).emit('userStopTyping', { userName: data.userName });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
