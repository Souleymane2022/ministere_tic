const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error');

function createApp() {
  const app = express();

  // Render / Vercel / Heroku placent l'app derrière un proxy
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS tolérant pour les déploiements gratuits (Vercel, Render, Netlify)
  const allowedOriginPatterns = [
    /^https?:\/\/localhost(:\d+)?$/,
    /\.vercel\.app$/,
    /\.onrender\.com$/,
    /\.netlify\.app$/,
  ];
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (env.CLIENT_URL && origin === env.CLIENT_URL) return cb(null, true);
      if (allowedOriginPatterns.some((r) => r.test(origin))) return cb(null, true);
      cb(new Error('Origin non autorisée : ' + origin));
    },
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
  }

  // Uploads publics
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_PATH)));

  // Mount Socket.io context
  app.use((req, res, next) => {
    req.io = app.get('io');
    next();
  });

  // API
  app.use('/api', routes);

  // Root
  app.get('/', (req, res) => {
    res.json({
      name: 'SHT Portail API',
      version: '1.0.0',
      docs: '/api/health',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
