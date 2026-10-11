// Very small in-memory limiter: allows one hit per key per window (resets when the server restarts)
const seen = new Map();

export function allowOnce(key, windowMs) {
  const now = Date.now();
  if (seen.size > 5000) {
    for (const [k, t] of seen) if (now - t > windowMs) seen.delete(k);
  }
  const last = seen.get(key);
  if (last && now - last < windowMs) return false;
  seen.set(key, now);
  return true;
}
