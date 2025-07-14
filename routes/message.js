const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.post('/send', auth, async (req, res) => {
  const { conversationId, receiverId, content } = req.body;
  const message = new Message({
    conversation: new mongoose.Types.ObjectId(conversationId),
    sender: req.user._id,
    receiver: new mongoose.Types.ObjectId(receiverId),
    content
  });
  await message.save();
  res.status(201).json(message);
});

router.get('/:conversationId', auth, async (req, res) => {
  const conversationId = new mongoose.Types.ObjectId(req.params.conversationId);
  const messages = await Message.find({ conversation: conversationId });
  res.json(messages);
});

module.exports = router;
