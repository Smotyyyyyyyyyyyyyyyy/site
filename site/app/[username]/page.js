import { notFound } from 'next/navigation';
import { avatarUrl, getPublicProfile } from '@/lib/profiles';
import ViewCounter from './ViewCounter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { username } = await params;
  const p = await getPublicProfile(username);
  if (!p) return { title: 'Not found' };
  return {
    title: `${p.display_name} (@${p.username})`,
    description: p.bio || `${p.display_name}'s links`,
    openGraph: { title: p.display_name, description: p.bio || undefined, images: [avatarUrl(p)] },
  };
}

export default async function Profile({ params }) {
  const { username } = await params;
  const p = await getPublicProfile(username);
  if (!p) notFound();
  const links = Array.isArray(p.links) ? p.links : [];

  return (
    <main className="profile" style={{ '--accent': p.accent }}>
      <div className="pcard">
        <img className="avatar" src={avatarUrl(p)} alt="" width="96" height="96" referrerPolicy="no-referrer" />
        <h1>{p.display_name}</h1>
        <p className="handle">@{p.username}</p>
        {p.bio && <p className="bio">{p.bio}</p>}
        {links.length > 0 && (
          <ul className="links">
            {links.map((l, i) => (
              <li key={i}>
                <a href={l.url} target="_blank" rel="noopener noreferrer nofollow ugc">{l.title}</a>
              </li>
            ))}
          </ul>
        )}
        <p className="views">{p.views.toLocaleString('en-US')} views</p>
      </div>
      <a className="made" href="/">Create your own page</a>
      <ViewCounter username={p.username} />
    </main>
  );
}
