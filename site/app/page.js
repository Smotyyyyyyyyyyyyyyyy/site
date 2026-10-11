import { getUser } from '@/lib/session';
import { SITE_NAME } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const user = await getUser();
  const sp = await searchParams;

  return (
    <main className="wrap hero">
      <h1>{SITE_NAME}</h1>
      <p>One page for all your links. Make it yours in a minute.</p>
      {sp?.error === 'login' && <div className="notice err">Login failed. Please try again.</div>}
      {user ? (
        <a className="btn" href={user.username ? '/dashboard' : '/onboarding'}>Go to dashboard</a>
      ) : (
        <a className="btn" href="/api/auth/login">Continue with Discord</a>
      )}
    </main>
  );
}
