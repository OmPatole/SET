import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import navbarRoutes from './routes/navbar.js';
import heroRoutes from './routes/hero.js';
import statsRoutes from './routes/stats.js';
import departmentsRoutes from './routes/departments.js';
import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';
import facilitiesRoutes from './routes/facilities.js';
import alumniRoutes from './routes/alumni.js';
import noticesRoutes from './routes/notices.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import pageRoutes from './routes/pages.js';
import applicationRoutes from './routes/applications.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:80', 'http://localhost'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/set_university')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SET Backend API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 SET Backend running on http://localhost:${PORT}`);
  console.log(`📖 API available at http://localhost:${PORT}/api`);
});
