const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://user:pass@rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertExchange('processed_images', 'fanout', { durable: true });

  const q = await ch.assertQueue('', { exclusive: true });
  ch.bindQueue(q.queue, 'processed_images', '');

  ch.consume(q.queue, msg => {
    console.log("Imagen procesada:", msg.content.toString());
    ch.ack(msg);
  });
})();
