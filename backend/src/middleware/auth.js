const { auth, db } = require('../config/firebase');

// Verifies the Firebase ID token sent by the app: "Authorization: Bearer <token>".
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    const decoded = await auth.verifyIdToken(token, true);
    const snap = await db.collection('users').doc(decoded.uid).get();
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      isAdmin: decoded.admin === true,
      role: decoded.admin === true ? 'admin' : snap.exists ? snap.get('role') : null,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
}

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'Not allowed for your role' });

const requireVerifiedEmail = (req, res, next) =>
  req.user?.emailVerified || req.user?.isAdmin ? next() : res.status(403).json({ error: 'Verify your email first' });

module.exports = { requireAuth, requireRole, requireVerifiedEmail };
