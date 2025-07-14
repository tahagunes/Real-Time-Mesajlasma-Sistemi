const { consumeQueue } = require('./services/rabbitmq');
const Message = require('./models/Message');
const AutoMessage = require('./models/AutoMessage');
const { io } = require('./app');

consumeQueue(async (msg) => {
  const message = await Message.create({
    conversation: msg.conversation,
    sender: msg.sender,
    receiver: msg.receiver,
    content: msg.content
  });

  io.to(msg.conversation).emit('message_received', message);

  await AutoMessage.findByIdAndUpdate(msg._id, { isSent: true });
});
