const router = require('express').Router();
const { admin, db } = require('../config/firebase');
const { requireAuth, requireRole } = require('../middleware/auth');
const { HttpError } = require('../middleware/errors');

router.use(requireAuth, requireRole('admin'));

// Doctors waiting for verification (no patient data involved).
router.get('/doctors/pending', async (req, res, next) => {
  try {
    const snap = await db.collection('doctors').where('verificationStatus', '==', 'pending').limit(100).get();
    res.json({ doctors: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (e) {
    next(e);
  }
});

// Approve or reject a doctor: body { status: 'verified' | 'rejected', note? }
router.post('/doctors/:id/verification', async (req, res, next) => {
  try {
    const { status, note } = req.body || {};
    if (!['verified', 'rejected'].includes(status)) throw new HttpError(400, 'status must be verified or rejected');
    const ref = db.collection('doctors').doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpError(404, 'Doctor not found');
    await ref.update({
      verificationStatus: status,
      verified: status === 'verified',
      verificationNote: typeof note === 'string' ? note.slice(0, 500) : null,
      verifiedBy: req.user.uid,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ id: req.params.id, verificationStatus: status });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
