import { redirect } from 'next/navigation';
import { claimUsernameAction } from '@/app/actions';
import { getUser } from '@/lib/session';
import { MESSAGES } from '@/lib/messages';
import { SITE_NAME } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Choose your username' };

export default async function Onboarding({ searchParams }) {
  const user = await getUser();
  if (!user) redirect('/');
  if (user.username) redirect('/dashboard');
  const sp = await searchParams;
  const error = MESSAGES[sp?.error];

  return (
    <main className="wrap">
      <div className="panel">
        <h2>Choose your username</h2>
        <p className="muted">
          This will be your address: {SITE_NAME}/<b>username</b>. You cannot change it later, so pick carefully.
        </p>
        {error && <div className="notice err">{error}</div>}
        <form action={claimUsernameAction}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" minLength={3} maxLength={20} required autoFocus autoComplete="off" />
          <p><button className="btn" type="submit">Claim username</button></p>
        </form>
      </div>
    </main>
  );
}
