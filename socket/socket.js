const jwt = require('jsonwebtoken');
const { io } = require('../app');
const redis = require('../services/redis');
const Message = require('../models/Message');

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  redis.addOnlineUser(socket.user.id);
  io.emit('user_online', { userId: socket.user.id });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', async (data) => {
    try {
      const Conversation = require('../models/Conversation');
      const conversation = await Conversation.findById(data.roomId);
      if (!conversation) {
        console.error('Conversation not found:', data.roomId);
        return;
      }
      const mongoose = require('mongoose');
      const roomObjectId = mongoose.Types.ObjectId(data.roomId);
      const receiverId = conversation.participants.find(
        id => id.toString() !== socket.user.id
      );
      const message = await Message.create({
        conversation: roomObjectId,
        sender: socket.user.id,
        receiver: receiverId,
        content: data.content
      });
      io.to(data.roomId).emit('message_received', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('typing', (data) => {
    io.to(data.roomId).emit('typing', { userId: socket.user.id });
  });

  socket.on('disconnect', () => {
    redis.removeOnlineUser(socket.user.id);
    io.emit('user_offline', { userId: socket.user.id });
  });
});

module.exports = io;
