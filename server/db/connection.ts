import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SCHEMA_VERSION = '1.0.0';

let pool: pg.Pool | null = null;
let initPromise: Promise<void> | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required for PostgreSQL');
    }
    pool = new pg.Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function queryOne<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] ?? null;
}

export async function queryAll<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

export async function withTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = runMigrations();
  }
  await initPromise;
}

async function runMigrations() {
  const schemaSql = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await query(schemaSql);

  const { ensureExtendedConfigSeeded } = await import('./migrateExtendedConfig.ts');
  await ensureExtendedConfigSeeded();

  const { ensureExperienceConfigSeeded } = await import('./migrateExperienceFeatures.ts');
  await ensureExperienceConfigSeeded();

  const { ensureGalleryDefaultsMigrated } = await import('./migrateGalleryDefaults.ts');
  await ensureGalleryDefaultsMigrated();

  const applied = await queryOne<{ version: string }>(
    'SELECT version FROM schema_migrations WHERE version = $1',
    [SCHEMA_VERSION],
  );

  if (!applied) {
    await query('INSERT INTO schema_migrations (version) VALUES ($1)', [SCHEMA_VERSION]);
  }
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    initPromise = null;
  }
}

// Back-compat alias used by store
export const getDatabase = initDatabase;
