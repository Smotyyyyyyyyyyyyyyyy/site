export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = process.env.SITE_NAME || 'clwn.wtf';
// Overridable only so the login flow can be tested without Discord
export const DISCORD_API = process.env.DISCORD_API_BASE || 'https://discord.com/api';
