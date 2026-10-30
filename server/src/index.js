import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// 👉 REQUIRED for Render / Cloud proxies so rateLimit works correctly
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.get('/health', (_q, res) => res.json({ ok: true }));
app.use('/api', routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const code = err.name === 'ValidationError' ? 400 : 500;
  res.status(code).json({ message: code === 400 ? err.message : 'Something went wrong' });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 5000, () => console.log('API running'));
}).catch((e) => { 
  console.error('MongoDB connection failed:', e.message); 
  process.exit(1); 
});