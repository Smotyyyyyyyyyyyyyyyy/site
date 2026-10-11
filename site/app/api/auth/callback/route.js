import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/config';
import { exchangeCode, fetchDiscordUser } from '@/lib/discord';
import { upsertDiscordUser } from '@/lib/profiles';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const go = (path) => NextResponse.redirect(new URL(path, SITE_URL));

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const code = params.get('code');
  const state = params.get('state');
  const saved = request.cookies.get('oauth_state')?.value;

  // The state must match the cookie set at login, otherwise someone is trying to forge a login
  if (!code || !state || !saved || state !== saved) return go('/?error=login');

  try {
    const token = await exchangeCode(code);
    const discordUser = await fetchDiscordUser(token.access_token);
    const user = await upsertDiscordUser(discordUser);
    await createSession(user.id);
    const res = go(user.username ? '/dashboard' : '/onboarding');
    res.cookies.delete('oauth_state');
    return res;
  } catch (err) {
    console.error('Login failed:', err.message);
    return go('/?error=login');
  }
}
