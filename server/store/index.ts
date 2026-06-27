import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_SALON_CONFIG } from '../../src/config/defaults.ts';
import type { SalonConfig } from '../../src/config/defaults.ts';
import type { AppointmentBooking } from '../../src/types.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');

const CONFIG_PATH = join(DATA_DIR, 'salon-config.json');
const BOOKINGS_PATH = join(DATA_DIR, 'bookings.json');
const ADMIN_PATH = join(DATA_DIR, 'admin.json');

export type PublicSalonConfig = Omit<SalonConfig, 'adminPassword'>;

interface AdminData {
  passwordHash: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function writeJson(path: string, data: unknown) {
  ensureDataDir();
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

export function initStore() {
  ensureDataDir();

  if (!existsSync(CONFIG_PATH)) {
    const { adminPassword: _, ...publicConfig } = DEFAULT_SALON_CONFIG;
    writeJson(CONFIG_PATH, publicConfig);
  }

  if (!existsSync(BOOKINGS_PATH)) {
    writeJson(BOOKINGS_PATH, []);
  }

  if (!existsSync(ADMIN_PATH)) {
    const defaultPassword = process.env.ADMIN_PASSWORD || DEFAULT_SALON_CONFIG.adminPassword;
    writeJson(ADMIN_PATH, { passwordHash: hashPassword(defaultPassword) } satisfies AdminData);
  }
}

export function getPublicConfig(): PublicSalonConfig {
  initStore();
  const config = readJson<PublicSalonConfig>(CONFIG_PATH);
  if (!config) {
    const { adminPassword: _, ...publicConfig } = DEFAULT_SALON_CONFIG;
    return publicConfig;
  }
  return config;
}

export function saveConfig(config: PublicSalonConfig): PublicSalonConfig {
  writeJson(CONFIG_PATH, config);
  return config;
}

export function resetConfig(): PublicSalonConfig {
  const { adminPassword: _, ...publicConfig } = DEFAULT_SALON_CONFIG;
  writeJson(CONFIG_PATH, publicConfig);
  return publicConfig;
}

export function verifyAdminPassword(password: string): boolean {
  initStore();
  const admin = readJson<AdminData>(ADMIN_PATH);
  if (!admin?.passwordHash) return false;
  return verifyPassword(password, admin.passwordHash);
}

export function updateAdminPassword(newPassword: string) {
  writeJson(ADMIN_PATH, { passwordHash: hashPassword(newPassword) } satisfies AdminData);
}

export function getBookings(): AppointmentBooking[] {
  initStore();
  return readJson<AppointmentBooking[]>(BOOKINGS_PATH) || [];
}

export function saveBookings(bookings: AppointmentBooking[]) {
  writeJson(BOOKINGS_PATH, bookings);
}

export function findServiceById(serviceId: string): { service: import('../../src/types.ts').Service; categoryId: string } | null {
  const config = getPublicConfig();
  for (const category of config.services) {
    const service = category.services.find((s) => s.id === serviceId);
    if (service) return { service, categoryId: category.id };
  }
  return null;
}

export function getBookedSlotsForDate(date: string): string[] {
  return getBookings()
    .filter((b) => b.preferredDate === date && b.status !== 'cancelled')
    .map((b) => b.preferredTime);
}

export function createBookingId(): string {
  return 'LM-' + Math.floor(100000 + Math.random() * 900000);
}
