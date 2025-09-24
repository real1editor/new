import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// API routes
app.post('/api/register', async (req, res) => {
  // This would be handled by Vercel serverless functions
  // For local testing, we'll mock the response
  console.log('Contact form submission:', req.body);
  res.json({ ok: true, message: 'Message received locally' });
});

app.post('/api/feedback', async (req, res) => {
  console.log('Feedback submission:', req.body);
  res.json({ ok: true, message: 'Feedback received locally' });
});

// Serve SPA for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
