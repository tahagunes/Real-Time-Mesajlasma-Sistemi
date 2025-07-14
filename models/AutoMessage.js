const mongoose = require('mongoose');

const AutoMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  sendDate: { type: Date, required: true },
  isQueued: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AutoMessage', AutoMessageSchema);
