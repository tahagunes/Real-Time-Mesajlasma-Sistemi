const cron = require('node-cron');
const AutoMessage = require('../models/AutoMessage');
const User = require('../models/User');
const rabbitmq = require('./rabbitmq');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Nightly job: Plan auto-messages
cron.schedule('0 2 * * *', async () => {
  const users = await User.find({ isActive: true });
  const shuffled = shuffle(users.map(u => u._id));
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const sender = shuffled[i];
    const receiver = shuffled[i + 1];
    const content = `Auto message from ${sender} to ${receiver}`;
    const sendDate = new Date();
    sendDate.setHours(2, 0, 0, 0);
    await AutoMessage.create({ sender, receiver, content, sendDate });
  }
});

// Minute job: Queue ready auto-messages
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const messages = await AutoMessage.find({ sendDate: { $lte: now }, isQueued: false });
  for (const msg of messages) {
    await rabbitmq.sendToQueue(msg);
    msg.isQueued = true;
    await msg.save();
  }
});

module.exports = cron;
