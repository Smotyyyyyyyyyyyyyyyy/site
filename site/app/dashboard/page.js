import { redirect } from 'next/navigation';
import { logoutAction, saveProfileAction } from '@/app/actions';
import { getUser } from '@/lib/session';
import { MESSAGES } from '@/lib/messages';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import { LINK_SLOTS } from '@/lib/validate';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

export default async function Dashboard({ searchParams }) {
  const user = await getUser();
  if (!user) redirect('/');
  if (!user.username) redirect('/onboarding');

  const sp = await searchParams;
  const error = MESSAGES[sp?.error];
  const ok = MESSAGES[sp?.ok];
  const links = Array.isArray(user.links) ? user.links : [];

  return (
    <main className="wrap">
      <div className="topbar">
        <div>
          <b>{SITE_NAME}</b>
          <div className="muted">Signed in as @{user.username}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a className="btn ghost" href={`/${user.username}`} target="_blank" rel="noopener">View my page</a>
          <form action={logoutAction}><button className="btn ghost" type="submit">Log out</button></form>
        </div>
      </div>

      <p className="muted">Your page: <a href={`/${user.username}`}>{SITE_URL}/{user.username}</a> · {user.views} views</p>
      {ok && <div className="notice ok">{ok}</div>}
      {error && <div className="notice err">{error}</div>}

      <form action={saveProfileAction}>
        <div className="panel">
          <h2>Profile</h2>
          <label htmlFor="display_name">Display name</label>
          <input id="display_name" name="display_name" type="text" maxLength={32} defaultValue={user.display_name || ''} required />
          <label htmlFor="bio">Bio (max 200 characters)</label>
          <textarea id="bio" name="bio" rows={3} maxLength={200} defaultValue={user.bio || ''} />
          <label htmlFor="accent">Accent color</label>
          <input id="accent" name="accent" type="color" defaultValue={user.accent || '#c1121f'} />
        </div>

        <div className="panel">
          <h2>Links</h2>
          <p className="muted">Leave a row empty to skip it. Links must start with http(s) or just be a domain.</p>
          {Array.from({ length: LINK_SLOTS }, (_, i) => (
            <div className="row" key={i}>
              <input name={`title_${i}`} type="text" maxLength={40} placeholder="Title" defaultValue={links[i]?.title || ''} aria-label={`Link ${i + 1} title`} />
              <input name={`url_${i}`} type="text" maxLength={500} placeholder="https://..." defaultValue={links[i]?.url || ''} aria-label={`Link ${i + 1} address`} />
            </div>
          ))}
        </div>

        <button className="btn" type="submit">Save</button>
      </form>
    </main>
  );
}
