export const LINK_SLOTS = 8;
export const MAX_LINKS = 20;
export const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{1,18}[a-z0-9]$/;

const RESERVED = new Set([
  'admin', 'administrator', 'api', 'app', 'assets', 'auth', 'billing', 'blog', 'dashboard', 'discord',
  'docs', 'help', 'home', 'login', 'logout', 'me', 'mod', 'moderator', 'null', 'onboarding', 'owner',
  'pricing', 'privacy', 'profile', 'register', 'root', 'settings', 'signup', 'static', 'staff', 'status',
  'support', 'system', 'terms', 'undefined', 'user', 'users', 'www',
]);

// Invisible / direction-changing characters are removed so nobody can disguise names or links
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g;

export function cleanLine(raw, max) {
  return String(raw ?? '').replace(INVISIBLE, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function cleanBlock(raw, max) {
  return String(raw ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(INVISIBLE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

export function validateUsername(raw) {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!USERNAME_RE.test(value)) return { error: 'username_invalid' };
  if (RESERVED.has(value)) return { error: 'username_reserved' };
  return { value };
}

export function normalizeUrl(raw) {
  let s = cleanLine(raw, 500);
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`; // no scheme typed: assume https
  let u;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null; // blocks javascript:, data:, etc.
  if (u.username || u.password) return null;
  if (!u.hostname.includes('.')) return null;
  const out = u.toString();
  return out.length <= 500 ? out : null;
}

export const isColor = (c) => /^#[0-9a-f]{6}$/i.test(c);
