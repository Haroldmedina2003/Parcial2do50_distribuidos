const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const amqp = require('amqplib');
const path = require('path');

const app = express();
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });
let statusDB = {};

let channel = null;
(async () => {
  const conn = await amqp.connect('amqp://user:pass@rabbitmq');
  channel = await conn.createChannel();
  await channel.assertQueue('resize_queue', { durable: true });
})();

app.post('/upload', upload.single('image'), (req, res) => {
  const id = uuidv4();
  const filePath = req.file.path;
  const newFilename = `${id}_${req.file.originalname}`;
  const newPath = path.join('uploads', newFilename);

  fs.renameSync(filePath, newPath);
  statusDB[id] = { status: 'uploaded', filename: newFilename };

  const msg = { id, filename: newFilename };
  channel.sendToQueue('resize_queue', Buffer.from(JSON.stringify(msg)), { persistent: true });

  res.json({ id });
});

app.get('/status/:id', (req, res) => {
  const result = statusDB[req.params.id];
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
