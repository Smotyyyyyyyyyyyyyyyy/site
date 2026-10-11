import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/profiles';
import { getUser } from '@/lib/session';
import { allowOnce } from '@/lib/ratelimit';
import { USERNAME_RE } from '@/lib/validate';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let username = '';
  try {
    username = String((await request.json()).username || '').toLowerCase();
  } catch {}
  if (!USERNAME_RE.test(username)) return NextResponse.json({ ok: false }, { status: 400 });

  // Your own visits do not count
  const me = await getUser();
  if (me && me.username === username) return NextResponse.json({ ok: true, counted: false });

  // One view per visitor per profile every 30 minutes
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (!allowOnce(`${ip}:${username}`, 30 * 60 * 1000)) return NextResponse.json({ ok: true, counted: false });

  await incrementViews(username);
  return NextResponse.json({ ok: true, counted: true });
}
