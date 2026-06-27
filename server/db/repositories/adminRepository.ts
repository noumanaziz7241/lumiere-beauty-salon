import { query, queryOne } from '../connection.ts';
import { hashPassword, verifyPassword } from '../../utils/password.ts';
import { DEFAULT_SALON_CONFIG } from '../../../src/config/defaults.ts';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM admin_users WHERE id = 1',
  );
  if (!row) return false;
  return verifyPassword(password, row.password_hash);
}

export async function updateAdminPassword(newPassword: string) {
  const hash = hashPassword(newPassword);
  const existing = await queryOne<{ id: number }>('SELECT id FROM admin_users WHERE id = 1');

  if (existing) {
    await query(`UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = 1`, [hash]);
  } else {
    await query('INSERT INTO admin_users (id, password_hash) VALUES (1, $1)', [hash]);
  }
}

export async function seedAdminPassword() {
  const existing = await queryOne<{ id: number }>('SELECT id FROM admin_users WHERE id = 1');
  if (existing) return;

  const defaultPassword = process.env.ADMIN_PASSWORD || DEFAULT_SALON_CONFIG.adminPassword;
  await query('INSERT INTO admin_users (id, password_hash) VALUES (1, $1)', [
    hashPassword(defaultPassword),
  ]);
}

/** Create missing admin row or apply ADMIN_PASSWORD when ADMIN_PASSWORD_RESET=true. */
export async function ensureAdminUser() {
  const existing = await queryOne<{ id: number }>('SELECT id FROM admin_users WHERE id = 1');
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!existing) {
    const password = envPassword || DEFAULT_SALON_CONFIG.adminPassword;
    await query('INSERT INTO admin_users (id, password_hash) VALUES (1, $1)', [
      hashPassword(password),
    ]);
    console.log('Admin user created from environment/default password');
    return;
  }

  if (process.env.ADMIN_PASSWORD_RESET === 'true' && envPassword) {
    await updateAdminPassword(envPassword);
    console.log('Admin password updated from ADMIN_PASSWORD (ADMIN_PASSWORD_RESET=true)');
  }
}

export async function importAdminHashFromJson(passwordHash: string) {
  const existing = await queryOne<{ id: number }>('SELECT id FROM admin_users WHERE id = 1');
  if (existing) return;
  await query('INSERT INTO admin_users (id, password_hash) VALUES (1, $1)', [passwordHash]);
}
