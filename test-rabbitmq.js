const { sendToQueue, consumeQueue } = require('./services/rabbitmq');

sendToQueue({ test: 'Hello RabbitMQ!' });

consumeQueue((msg) => {
  console.log('Received from queue:', msg);
});
