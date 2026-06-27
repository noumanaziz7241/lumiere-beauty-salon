import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { PublicSalonConfig } from '../../src/config/defaults.ts';
import type { AppointmentBooking } from '../../src/types.ts';
import { initDatabase } from '../db/connection.ts';
import {
  loadPublicConfig,
  savePublicConfig,
  resetPublicConfig,
  findServiceById,
} from '../db/repositories/configRepository.ts';
import {
  getBookings as queryBookings,
  createBooking,
  updateBookingStatus,
  getBookedSlotsForDate,
  createBookingId,
  hasConfirmedBookingForPhone,
  ADMIN_BOOKINGS_DAYS,
} from '../db/repositories/bookingRepository.ts';
import {
  verifyAdminPassword,
  updateAdminPassword,
  seedAdminPassword,
  ensureAdminUser,
  importAdminHashFromJson,
} from '../db/repositories/adminRepository.ts';
import {
  isDatabaseSeeded,
  seedDefaultConfig,
  seedFromConfig,
  importBookingsFromJson,
} from '../db/seed.ts';

export type { PublicSalonConfig };

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
const LEGACY_CONFIG_PATH = join(DATA_DIR, 'salon-config.json');
const LEGACY_BOOKINGS_PATH = join(DATA_DIR, 'bookings.json');
const LEGACY_ADMIN_PATH = join(DATA_DIR, 'admin.json');

let storeInitPromise: Promise<void> | null = null;

function readLegacyJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T;
  } catch {
    return null;
  }
}

async function migrateFromLegacyJson() {
  const legacyConfig = readLegacyJson<PublicSalonConfig>(LEGACY_CONFIG_PATH);
  const legacyBookings = readLegacyJson<AppointmentBooking[]>(LEGACY_BOOKINGS_PATH);
  const legacyAdmin = readLegacyJson<{ passwordHash: string }>(LEGACY_ADMIN_PATH);

  if (legacyConfig) {
    await seedFromConfig(legacyConfig);
  } else {
    await seedDefaultConfig();
  }

  if (legacyBookings?.length) {
    await importBookingsFromJson(legacyBookings);
  }

  if (legacyAdmin?.passwordHash) {
    await importAdminHashFromJson(legacyAdmin.passwordHash);
  } else {
    await seedAdminPassword();
  }
}

export async function initStore() {
  if (!storeInitPromise) {
    storeInitPromise = (async () => {
      await initDatabase();

      if (!(await isDatabaseSeeded())) {
        if (existsSync(LEGACY_CONFIG_PATH)) {
          await migrateFromLegacyJson();
        } else {
          await seedDefaultConfig();
          await seedAdminPassword();
        }
      }

      // DB may be seeded without admin_users (e.g. partial deploy) — always ensure admin exists
      await ensureAdminUser();
    })();
  }
  await storeInitPromise;
}

export async function getPublicConfig(): Promise<PublicSalonConfig> {
  await initStore();
  return loadPublicConfig();
}

export async function saveConfig(config: PublicSalonConfig): Promise<PublicSalonConfig> {
  await initStore();
  return savePublicConfig(config);
}

export async function resetConfig(): Promise<PublicSalonConfig> {
  await initStore();
  return resetPublicConfig();
}

export { verifyAdminPassword, updateAdminPassword, findServiceById, getBookedSlotsForDate, createBookingId, hasConfirmedBookingForPhone, ADMIN_BOOKINGS_DAYS };

export async function getBookings(filters?: {
  date?: string;
  status?: string;
  daysBack?: number;
}): Promise<AppointmentBooking[]> {
  await initStore();
  return queryBookings(filters);
}

export async function insertBooking(booking: AppointmentBooking): Promise<AppointmentBooking> {
  await initStore();
  return createBooking(booking);
}

export async function patchBookingStatus(
  id: string,
  status: AppointmentBooking['status'],
): Promise<AppointmentBooking | null> {
  await initStore();
  return updateBookingStatus(id, status);
}
