const amqp = require('amqplib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  const conn = await amqp.connect('amqp://user:pass@rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertQueue('resize_queue', { durable: true });
  await ch.assertQueue('watermark_queue', { durable: true });
  ch.prefetch(1);

  ch.consume('resize_queue', async msg => {
    const data = JSON.parse(msg.content.toString());
    const input = `uploads/${data.filename}`;
    const output = `uploads/resized-${data.filename}`;

    await sharp(input).resize(300).toFile(output);
    data.filename = `resized-${data.filename}`;
    ch.sendToQueue('watermark_queue', Buffer.from(JSON.stringify(data)), { persistent: true });
    ch.ack(msg);
  }, { noAck: false });
})();
