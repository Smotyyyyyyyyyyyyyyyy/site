import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { authorizeUrl } from '@/lib/discord';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = crypto.randomBytes(24).toString('hex');
  const res = NextResponse.redirect(authorizeUrl(state));
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
