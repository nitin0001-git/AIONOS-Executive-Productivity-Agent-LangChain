import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import agentRoutes from './routes/agent.js';
import { isGeminiConfigured, getModelName } from './services/llm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Security & Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/static')) {
      console.log(`[HTTP] ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api', agentRoutes);

// Serve static frontend build if available
const frontendDist = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Fallback to index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).json({
        message: 'AIONOS Executive Productivity Agent Backend Running',
        targetUser: 'Arjun Malhotra (VP Sales)',
        geminiConfigured: isGeminiConfigured(),
        model: getModelName(),
        docs: '/api/health'
      });
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` AIONOS Executive Productivity Agent Backend`);
  console.log(` Built for: Arjun Malhotra (VP Sales)`);
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` LangChain Gemini Orchestrator: ${isGeminiConfigured()} (${getModelName()})`);
  console.log(`====================================================`);
});

export default app;
