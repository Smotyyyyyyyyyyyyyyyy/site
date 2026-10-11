import pg from 'pg';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  discord_id TEXT UNIQUE NOT NULL,
  discord_username TEXT,
  discord_avatar TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT '#c1121f',
  links JSONB NOT NULL DEFAULT '[]',
  views INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

// One pool for the whole process (kept on globalThis so dev reloads do not open more connections)
const pool =
  globalThis.__pgPool ||
  (globalThis.__pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: 10,
  }));

let schemaReady = null;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(SCHEMA).catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export async function query(text, params) {
  await ensureSchema();
  return pool.query(text, params);
}
