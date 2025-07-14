const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  const { participantIds } = req.body;
  const conversation = new Conversation({ participants: participantIds });
  await conversation.save();
  res.status(201).json(conversation);
});

router.get('/my', auth, async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id });
  res.json(conversations);
});

module.exports = router;
