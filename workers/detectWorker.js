const amqp = require('amqplib');
const fs = require('fs');

(async () => {
  const conn = await amqp.connect('amqp://user:pass@rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertQueue('detect_queue', { durable: true });
  await ch.assertExchange('processed_images', 'fanout', { durable: true }); // 🔥 Confirmado y correcto
  ch.prefetch(1);

  ch.consume('detect_queue', async msg => {
    const data = JSON.parse(msg.content.toString());
    data.status = 'processed';

    fs.writeFileSync(`uploads/${data.id}.json`, JSON.stringify(data, null, 2));
    ch.publish('processed_images', '', Buffer.from(JSON.stringify(data)));
    ch.ack(msg);
  }, { noAck: false });
})();
