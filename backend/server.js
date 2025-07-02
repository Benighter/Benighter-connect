const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Enable CORS for all routes
app.use(cors());

// Store rooms and participants
const rooms = new Map();
// Store room passwords
const roomPasswords = new Map();

console.log('Server starting...');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Benighter Connect Backend',
    status: 'running',
    socketio: 'available at /socket.io/',
    health: '/health'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Benighter Connect Backend is running!' });
});

// API endpoint to get room info
app.get('/api/room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const roomExists = rooms.has(roomId);
  const hasPassword = roomPasswords.has(roomId);
  
  res.json({
    exists: roomExists,
    hasPassword: hasPassword,
    roomId: roomId
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', (roomId, userName, password = '') => {
    // Check if room exists and has a password
    if (rooms.has(roomId) && roomPasswords.has(roomId)) {
      const roomPassword = roomPasswords.get(roomId);
      if (roomPassword && roomPassword !== password) {
        socket.emit('join-error', 'Incorrect password');
        return;
      }
    }

    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
      console.log(`Room ${roomId} created`);
    }

    const room = rooms.get(roomId);
    room.add(socket.id);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName;

    console.log(`${userName} joined room ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { id: socket.id, name: userName });
    
    // Send current users to the new user
    const currentUsers = Array.from(room).filter(id => id !== socket.id);
    socket.emit('current-users', currentUsers);
  });

  // Create room
  socket.on('create-room', (roomId, userName, password = '') => {
    if (rooms.has(roomId)) {
      socket.emit('room-exists', 'Room already exists');
      return;
    }

    // Create new room
    rooms.set(roomId, new Set([socket.id]));
    if (password) {
      roomPasswords.set(roomId, password);
    }
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName;

    console.log(`Room ${roomId} created by ${userName}`);
    socket.emit('room-created', roomId);
  });

  // Validate room exists
  socket.on('validate-room', (roomId) => {
    console.log(`Validating room: ${roomId}`);
    console.log(`Available rooms:`, Array.from(rooms.keys()));
    
    const roomExists = rooms.has(roomId);
    const hasPassword = roomPasswords.has(roomId);
    
    socket.emit('room-validation', {
      exists: roomExists,
      hasPassword: hasPassword,
      roomId: roomId
    });
  });

  // Handle WebRTC signaling
  socket.on('offer', (offer, targetId) => {
    console.log(`📤 Received offer from ${socket.id}, relaying to ${data.target}`);
    console.log(`📋 Offer data:`, data);
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id
    });
  });

  socket.on('answer', (data) => {
    console.log(`📤 Received answer from ${socket.id}, relaying to ${data.target}`);
    console.log(`📋 Answer data:`, data);
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    console.log(`🧊 Received ICE candidate from ${socket.id}, relaying to ${data.target}`);
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // Chat messages
  socket.on('chat-message', (message, roomId) => {
    if (socket.roomId === roomId) {
      const messageData = {
        id: uuidv4(),
        text: message,
        sender: socket.userName,
        timestamp: new Date().toISOString(),
        type: 'public'
      };
      
      io.to(roomId).emit('chat-message', messageData);
      console.log(`Chat message in ${roomId}: ${socket.userName}: ${message}`);
    }
  });

  // Private messages
  socket.on('private-message', (message, targetId, roomId) => {
    if (socket.roomId === roomId) {
      const messageData = {
        id: uuidv4(),
        text: message,
        sender: socket.userName,
        timestamp: new Date().toISOString(),
        type: 'private'
      };
      
      // Send to target user
      socket.to(targetId).emit('private-message', messageData);
      // Send back to sender for confirmation
      socket.emit('private-message', messageData);
      
      console.log(`Private message from ${socket.userName} to ${targetId}: ${message}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId) {
      const room = rooms.get(socket.roomId);
      if (room) {
        room.delete(socket.id);
        
        // If room is empty, delete it
        if (room.size === 0) {
          rooms.delete(socket.roomId);
          roomPasswords.delete(socket.roomId);
          console.log(`Room ${socket.roomId} deleted (empty)`);
        } else {
          // Notify others in the room
          socket.to(socket.roomId).emit('user-left', socket.id);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log('Starting Benighter Connect server...');
  console.log(`🎥 Benighter Connect Server running on port ${PORT}`);
  console.log('📱 Professional video conferencing made simple!');
  console.log('🔗 Created by Bennet Nkolele (Benighter)');
  console.log('🌟 GitHub: https://github.com/Benighter');
});
