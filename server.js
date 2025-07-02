const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store rooms and participants
const rooms = new Map();
// Store room passwords
const roomPasswords = new Map();
// Store room hosts (first person to join becomes host)
const roomHosts = new Map();

console.log('Server starting...');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

app.get('/room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
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

    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = userName;

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
      // First person to join becomes the host
      roomHosts.set(roomId, socket.id);
    }

    // Add user to room
    rooms.get(roomId).add({
      id: socket.id,
      name: userName,
      isHost: roomHosts.get(roomId) === socket.id
    });

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      id: socket.id,
      name: userName,
      isHost: roomHosts.get(roomId) === socket.id
    });

    // Send current participants to new user
    const participants = Array.from(rooms.get(roomId));
    socket.emit('room-participants', participants);

    // Send updated participant list to all users in room
    io.to(roomId).emit('participants-updated', participants);

    console.log(`${userName} joined room ${roomId}`);
  });

  // Create room with password
  socket.on('create-room', (roomId, password) => {
    if (password && password.trim()) {
      roomPasswords.set(roomId, password.trim());
      console.log(`Room ${roomId} created with password protection`);
    }
    socket.emit('room-created', roomId);
  });

  // Validate room exists
  socket.on('validate-room', (roomId) => {
    console.log(`Validating room: ${roomId}`); // Debug log
    console.log(`Available rooms:`, Array.from(rooms.keys())); // Debug log

    const roomExists = rooms.has(roomId);
    const hasPassword = roomPasswords.has(roomId);

    console.log(`Room ${roomId} exists: ${roomExists}, has password: ${hasPassword}`); // Debug log

    socket.emit('room-validation', {
      exists: roomExists,
      hasPassword: hasPassword,
      roomId: roomId
    });
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    if (socket.roomId) {
      // Validate message
      if (!data.message || typeof data.message !== 'string') {
        return;
      }

      const message = data.message.trim();
      if (!message || message.length > 500) {
        return;
      }

      // Basic spam prevention - check if user is sending too many messages
      const now = Date.now();
      if (!socket.lastMessageTime) socket.lastMessageTime = 0;
      if (now - socket.lastMessageTime < 1000) {
        return; // Rate limit: 1 message per second
      }
      socket.lastMessageTime = now;

      io.to(socket.roomId).emit('chat-message', {
        message: message,
        sender: socket.userName,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });

  // Handle private messages
  socket.on('private-message', (data) => {
    if (socket.roomId && data.targetId && data.message) {
      // Validate message
      if (typeof data.message !== 'string') {
        return;
      }

      const message = data.message.trim();
      if (!message || message.length > 500) {
        return;
      }

      // Basic spam prevention for private messages
      const now = Date.now();
      if (!socket.lastPrivateMessageTime) socket.lastPrivateMessageTime = 0;
      if (now - socket.lastPrivateMessageTime < 500) {
        return; // Rate limit: 1 private message per 0.5 seconds
      }
      socket.lastPrivateMessageTime = now;

      // Send to target user
      socket.to(data.targetId).emit('private-message', {
        message: message,
        sender: socket.userName,
        senderId: socket.id,
        timestamp: new Date().toLocaleTimeString(),
        isPrivate: true
      });

      // Send back to sender for confirmation
      socket.emit('private-message', {
        message: message,
        sender: socket.userName,
        senderId: socket.id,
        targetId: data.targetId,
        timestamp: new Date().toLocaleTimeString(),
        isPrivate: true,
        isSent: true
      });
    }
  });

  // Handle screen sharing
  socket.on('screen-share-start', () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('screen-share-start', socket.id);
    }
  });

  socket.on('screen-share-stop', () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('screen-share-stop', socket.id);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId && rooms.has(socket.roomId)) {
      const room = rooms.get(socket.roomId);

      // Find and remove the participant
      let participantToRemove = null;
      room.forEach(participant => {
        if (participant.id === socket.id) {
          participantToRemove = participant;
        }
      });

      if (participantToRemove) {
        room.delete(participantToRemove);
      }

      // Notify others in the room
      socket.to(socket.roomId).emit('user-left', socket.id);

      // Send updated participant list to remaining users
      const participants = Array.from(room);
      socket.to(socket.roomId).emit('participants-updated', participants);

      // Clean up empty rooms
      if (room.size === 0) {
        rooms.delete(socket.roomId);
        roomPasswords.delete(socket.roomId);
        roomHosts.delete(socket.roomId);
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🎥 Benighter Connect Server running on http://localhost:${PORT}`);
  console.log(`📱 Professional video conferencing made simple!`);
  console.log(`🔗 Created by Bennet Nkolele (Benighter)`);
  console.log(`🌟 GitHub: https://github.com/Benighter`);
});

console.log('Starting Benighter Connect server...');
