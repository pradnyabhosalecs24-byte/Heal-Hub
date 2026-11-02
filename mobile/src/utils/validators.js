export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const normalizePhone = v => String(v).replace(/[\s-]/g, '');
export const isPhone = v => /^(\+?\d{1,3})?\d{10}$/.test(normalizePhone(v));
export const isStrongPassword = v => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);

// DD-MM-YYYY -> Date (or null). Rejects impossible dates, future dates and ages > 120.
export function parseDob(v) {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(String(v).trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCDate() !== d || date.getUTCMonth() !== mo - 1) return null;
  const now = new Date();
  if (date > now || now.getUTCFullYear() - y > 120) return null;
  return date;
}

// Returns an object of field -> message. Empty object means valid.
export function validate(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, checks]) => {
    for (const [ok, msg] of checks) {
      if (!ok(values[field], values)) {
        errors[field] = msg;
        break;
      }
    }
  });
  return errors;
}
export const required = v => String(v ?? '').trim().length > 0;
