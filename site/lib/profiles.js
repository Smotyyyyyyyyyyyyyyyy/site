import { query } from './db';
import {
  MAX_LINKS, USERNAME_RE, cleanBlock, cleanLine, isColor, normalizeUrl, validateUsername,
} from './validate';

export function avatarUrl(user) {
  if (user.discord_avatar) {
    const ext = user.discord_avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.discord_avatar}.${ext}?size=256`;
  }
  const index = Number((BigInt(user.discord_id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export async function upsertDiscordUser(d) {
  const name = cleanLine(d.global_name || d.username, 32) || 'user';
  const { rows } = await query(
    `INSERT INTO users (discord_id, discord_username, discord_avatar, display_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (discord_id) DO UPDATE
       SET discord_username = EXCLUDED.discord_username, discord_avatar = EXCLUDED.discord_avatar
     RETURNING *`,
    [d.id, d.username, d.avatar || null, name]
  );
  return rows[0];
}

export async function claimUsername(userId, raw) {
  const v = validateUsername(raw);
  if (v.error) return { error: v.error };
  try {
    const res = await query('UPDATE users SET username = $1 WHERE id = $2 AND username IS NULL', [v.value, userId]);
    if (!res.rowCount) return { error: 'username_set' };
    return { ok: true, username: v.value };
  } catch (err) {
    if (err.code === '23505') return { error: 'username_taken' };
    throw err;
  }
}

export async function saveProfile(userId, input) {
  const display = cleanLine(input.displayName, 32);
  if (!display) return { error: 'name_invalid' };

  const accent = String(input.accent || '').toLowerCase();
  if (!isColor(accent)) return { error: 'color_invalid' };

  const links = [];
  for (const row of input.links || []) {
    const title = cleanLine(row.title, 40);
    const rawUrl = String(row.url || '').trim();
    if (!title && !rawUrl) continue; // empty slot
    const url = normalizeUrl(rawUrl);
    if (!url) return { error: 'link_invalid' };
    links.push({ title: title || new URL(url).hostname.replace(/^www\./, ''), url });
    if (links.length >= MAX_LINKS) break;
  }

  await query('UPDATE users SET display_name = $1, bio = $2, accent = $3, links = $4::jsonb WHERE id = $5', [
    display, cleanBlock(input.bio, 200), accent, JSON.stringify(links), userId,
  ]);
  return { ok: true };
}

export async function getPublicProfile(username) {
  const name = String(username || '').toLowerCase();
  if (!USERNAME_RE.test(name)) return null;
  const { rows } = await query(
    'SELECT discord_id, discord_avatar, username, display_name, bio, accent, links, views FROM users WHERE username = $1',
    [name]
  );
  return rows[0] || null;
}

export async function incrementViews(username) {
  await query('UPDATE users SET views = views + 1 WHERE username = $1', [username]);
}
