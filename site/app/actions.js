'use server';

import { redirect } from 'next/navigation';
import { destroySession, getUser } from '@/lib/session';
import { claimUsername, saveProfile } from '@/lib/profiles';
import { LINK_SLOTS } from '@/lib/validate';

export async function claimUsernameAction(formData) {
  const user = await getUser();
  if (!user) redirect('/');
  const res = await claimUsername(user.id, String(formData.get('username') || ''));
  if (res.error) redirect(`/onboarding?error=${res.error}`);
  redirect('/dashboard?ok=welcome');
}

export async function saveProfileAction(formData) {
  const user = await getUser();
  if (!user || !user.username) redirect('/');

  const links = [];
  for (let i = 0; i < LINK_SLOTS; i++) {
    links.push({ title: String(formData.get(`title_${i}`) || ''), url: String(formData.get(`url_${i}`) || '') });
  }
  const res = await saveProfile(user.id, {
    displayName: String(formData.get('display_name') || ''),
    bio: String(formData.get('bio') || ''),
    accent: String(formData.get('accent') || ''),
    links,
  });
  redirect(res.error ? `/dashboard?error=${res.error}` : '/dashboard?ok=saved');
}

export async function logoutAction() {
  await destroySession();
  redirect('/');
}
