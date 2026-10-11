'use client';

import { useEffect } from 'react';

// Counts one view per browser session. Bots that do not run JavaScript are not counted.
export default function ViewCounter({ username }) {
  useEffect(() => {
    const key = `viewed:${username}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {}
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
      keepalive: true,
    }).catch(() => {});
  }, [username]);
  return null;
}
