const MESSAGES = {
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 8 characters with letters and numbers.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'No internet connection. Signing in and registering need internet.',
  'auth/user-disabled': 'This account has been disabled. Contact HEALHUB support.',
  'firestore/unavailable': 'Server unreachable. Check your connection and try again.',
  'firestore/permission-denied': 'You do not have permission to do that.',
};

export function friendlyError(e) {
  if (e?.friendly) return e.message;
  return MESSAGES[e?.code] || 'Something went wrong. Please try again.';
}

export function appError(message) {
  const err = new Error(message);
  err.friendly = true;
  return err;
}
