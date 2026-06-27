import type { PublicSalonConfig } from '../config/defaults';
import type { AppointmentBooking } from '../types';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function connectionHelpMessage(): string {
  return (
    'API server is not reachable. In the project folder run: npm run db:up (PostgreSQL), then npm run dev (starts frontend + API together).'
  );
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
  } catch {
    throw new ApiError(0, connectionHelpMessage());
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: '' }));
    const message =
      body.error ||
      (res.status >= 500 ? connectionHelpMessage() : res.statusText || 'Request failed');
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  getConfig: () => request<PublicSalonConfig>('/config'),

  updateConfig: (config: PublicSalonConfig) =>
    request<PublicSalonConfig>('/config', { method: 'PUT', body: JSON.stringify(config) }),

  resetConfig: () =>
    request<PublicSalonConfig>('/config/reset', { method: 'POST' }),

  login: (password: string) =>
    request<{ success: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  logout: () =>
    request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  checkAuth: () =>
    request<{ authenticated: boolean }>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getAvailability: (date: string) =>
    request<{ date: string; availableSlots: string[]; bookedSlots: string[] }>(
      `/bookings/availability?date=${encodeURIComponent(date)}`
    ),

  createBooking: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    preferredDate: string;
    preferredTime: string;
    serviceIds: string[];
    notes?: string;
  }) =>
    request<AppointmentBooking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getBookings: (params?: { date?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return request<{ bookings: AppointmentBooking[] }>(`/bookings${qs ? `?${qs}` : ''}`);
  },

  updateBookingStatus: (id: string, status: AppointmentBooking['status']) =>
    request<AppointmentBooking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
