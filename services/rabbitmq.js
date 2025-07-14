const amqp = require('amqplib');

const QUEUE = 'message_sending_queue';
let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
}

async function sendToQueue(message) {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
}

async function consumeQueue(onMessage) {
  if (!channel) await connectRabbitMQ();
  channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      await onMessage(data);
      channel.ack(msg);
    }
  });
}

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue };
