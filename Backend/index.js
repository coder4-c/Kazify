const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(port, () => console.log(`Backend listening on ${port}`));
