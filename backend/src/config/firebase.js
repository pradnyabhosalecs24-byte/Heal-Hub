const admin = require('firebase-admin');

function loadCredentials() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set. See docs/SETUP.md.');
  return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadCredentials()),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

module.exports = { admin, db: admin.firestore(), auth: admin.auth() };
