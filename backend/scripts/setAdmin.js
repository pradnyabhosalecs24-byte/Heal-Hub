// Grants the admin role to an existing Firebase user (admins cannot self-register).
// Usage: npm run set-admin -- admin@example.com
require('dotenv').config();
const { auth } = require('../src/config/firebase');

(async () => {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npm run set-admin -- <email>');
    process.exit(1);
  }
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  console.log(`✔ ${email} is now a HEALHUB administrator. They must sign out and back in.`);
  process.exit(0);
})().catch(e => {
  console.error('Failed:', e.message);
  process.exit(1);
});
