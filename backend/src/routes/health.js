const router = require('express').Router();
const { db } = require('../config/firebase');

// Render health check + quick Firestore connectivity probe.
router.get('/', async (req, res) => {
  const started = Date.now();
  let firestore = 'ok';
  try {
    await db.collection('_health').limit(1).get();
  } catch (e) {
    firestore = 'unreachable';
  }
  res.status(firestore === 'ok' ? 200 : 503).json({
    status: firestore === 'ok' ? 'ok' : 'degraded',
    service: 'healhub-api',
    firestore,
    uptimeSec: Math.round(process.uptime()),
    latencyMs: Date.now() - started,
    time: new Date().toISOString(),
  });
});

module.exports = router;
