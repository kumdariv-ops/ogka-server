const express = require('express');
const Pusher = require('pusher');

const app = express();
app.use(express.json());
app.use(express.text());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const pusher = new Pusher({
  appId: '2154187',
  key: '69f9ad5906d1c037ac15',
  secret: '3322d642d61425ab4698',
  cluster: 'eu',
  useTLS: true
});

app.post('/data', (req, res) => {
  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    pusher.trigger('ogka-channel', 'ogka-data', data);
    console.log('Veri alindi:', JSON.stringify(data).substring(0, 50));
  } catch(e) {
    console.log('Parse hatasi:', e.message);
  }
  res.status(200).json({ ok: true });
});

app.get('/', (req, res) => res.status(200).send('OGKA Server calisiyor'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('OGKA Server port:', PORT));
