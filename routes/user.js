const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/list', auth, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

module.exports = router;
