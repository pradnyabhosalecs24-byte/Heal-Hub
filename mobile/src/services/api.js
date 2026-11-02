import { API_URL } from '../config/env';
import { auth } from './firebase';

// Authenticated call to the HEALHUB backend (Render). Sends the Firebase ID token.
export async function api(path, { method = 'GET', body, timeoutMs = 20000 } = {}) {
  const token = await auth.currentUser?.getIdToken();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status });
    return data;
  } finally {
    clearTimeout(timer);
  }
}
