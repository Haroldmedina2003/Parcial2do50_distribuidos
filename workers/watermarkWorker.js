const amqp = require('amqplib');
const sharp = require('sharp');

(async () => {
  const conn = await amqp.connect('amqp://user:pass@rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertQueue('watermark_queue', { durable: true });
  await ch.assertQueue('detect_queue', { durable: true });
  ch.prefetch(1);

  ch.consume('watermark_queue', async msg => {
    const data = JSON.parse(msg.content.toString());
    const input = `uploads/${data.filename}`;
    const output = `uploads/watermarked-${data.filename}`;

    await sharp(input)
      .composite([{ input: Buffer.from('<svg><text x="10" y="20">Marca</text></svg>'), top: 10, left: 10 }])
      .toFile(output);

    data.filename = `watermarked-${data.filename}`;
    ch.sendToQueue('detect_queue', Buffer.from(JSON.stringify(data)), { persistent: true });
    ch.ack(msg);
  }, { noAck: false });
})();
