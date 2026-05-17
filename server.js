const express = require('express');
const Pusher = require('pusher');
const https = require('https');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
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
    console.log('Veri alindi');
  } catch(e) { console.log('Parse hatasi:', e.message); }
  res.status(200).json({ ok: true });
});

app.post('/ai', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system, messages })
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    console.log('AI hata:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.status(200).send('OGKA Server calisiyor'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('OGKA Server port:', PORT));
