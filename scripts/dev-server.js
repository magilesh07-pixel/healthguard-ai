const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

if (!globalThis.fetch) {
  console.error('ERROR: Native fetch not found. Please use Node.js 18 or higher.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Import the actual handler logic
const analyzeHandler = require('../api/analyze').default;
const chatHandler = require('../api/chat').default;

// Helper to wrap Vercel-style handlers for Express
function vercelBridge(handler) {
  return async (req, res) => {
    console.log(`--- Incoming Local API Request: ${req.path} ---`);
    const vercelRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data)
      })
    };
    try {
      await handler(req, vercelRes);
    } catch (error) {
      console.error('Local Bridge Error:', error);
      res.status(500).json({ error: 'Local Bridge internal error' });
    }
  };
}

app.post('/api/analyze', vercelBridge(analyzeHandler));
app.post('/api/chat', vercelBridge(chatHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 Local API Bridge running at http://localhost:${PORT}`);
});
