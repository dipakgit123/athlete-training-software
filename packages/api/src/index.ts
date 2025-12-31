/**
 * API Server Entry Point
 * Elite Athletics Performance System
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import athleteRoutes from './routes/athlete.routes';
import wellnessRoutes from './routes/wellness.routes';
import sessionRoutes from './routes/session.routes';
import analysisRoutes from './routes/analysis.routes';
import planningRoutes from './routes/planning.routes';
import alertRoutes from './routes/alert.routes';
import reportRoutes from './routes/report.routes';
import testingRoutes from './routes/testing.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Elite Athletics Performance System API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tests', testingRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`
  ========================================
  🏃 Elite Athletics Performance System
  ========================================
  🚀 Server running on port ${PORT}
  📊 API: http://localhost:${PORT}/api
  💚 Health: http://localhost:${PORT}/health
  ========================================
  `);
});

export default app;
