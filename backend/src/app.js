const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy

const origins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(helmet());
app.use(
  cors({
    // Native mobile requests have no Origin header and are allowed; browsers must be whitelisted.
    origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/', (req, res) => res.json({ name: 'HEALHUB API', docs: '/health' }));
app.use('/health', require('./routes/health'));
app.use('/api/me', require('./routes/me'));
app.use('/api/admin', require('./routes/admin'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
