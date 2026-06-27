import type { AppointmentBooking } from '../../../src/types.ts';
import { ADMIN_BOOKINGS_DAYS, normalizePhoneKey } from '../../../shared/bookingPricing.ts';
import { query, queryOne, queryAll, withTransaction } from '../connection.ts';

export async function getBookings(filters?: {
  date?: string;
  status?: string;
  daysBack?: number;
}): Promise<AppointmentBooking[]> {
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  const params: (string | number)[] = [];
  let paramIdx = 1;

  if (filters?.daysBack != null && filters.daysBack > 0) {
    sql += ` AND preferred_date >= to_char(CURRENT_DATE - $${paramIdx++}::integer, 'YYYY-MM-DD')`;
    params.push(filters.daysBack);
  }

  if (filters?.date) {
    sql += ` AND preferred_date = $${paramIdx++}`;
    params.push(filters.date);
  }
  if (filters?.status) {
    sql += ` AND status = $${paramIdx++}`;
    params.push(filters.status);
  }

  sql += ' ORDER BY preferred_date DESC, created_at DESC';

  const rows = await queryAll<BookingRow>(sql, params);
  return Promise.all(rows.map(rowToBooking));
}

export async function hasConfirmedBookingForPhone(phone: string): Promise<boolean> {
  const phoneKey = normalizePhoneKey(phone);
  if (!phoneKey) return false;

  const row = await queryOne<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM bookings
     WHERE status = 'confirmed'
     AND RIGHT(regexp_replace(customer_phone, '\\D', '', 'g'), 10) = $1`,
    [phoneKey],
  );

  return row ? parseInt(row.count, 10) > 0 : false;
}

export async function getBookingById(id: string): Promise<AppointmentBooking | null> {
  const row = await queryOne<BookingRow>('SELECT * FROM bookings WHERE id = $1', [id]);
  if (!row) return null;
  return rowToBooking(row);
}

export async function createBooking(booking: AppointmentBooking): Promise<AppointmentBooking> {
  const subtotal = booking.subtotalPrice ?? booking.totalPrice;
  const discountPercent = booking.discountPercent ?? 0;
  const discountAmount = booking.discountAmount ?? 0;

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO bookings (
         id, customer_name, customer_phone, customer_email, preferred_date, preferred_time,
         total_price, subtotal_pkr, discount_percent, discount_pkr, status, notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        booking.id,
        booking.customerName,
        booking.customerPhone,
        booking.customerEmail,
        booking.preferredDate,
        booking.preferredTime,
        booking.totalPrice,
        subtotal,
        discountPercent,
        discountAmount,
        booking.status,
        booking.notes ?? null,
      ],
    );

    for (const svc of booking.selectedServices) {
      await client.query(
        `INSERT INTO booking_services (booking_id, service_id, service_name, estimated_duration, price_pkr, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          booking.id,
          svc.id,
          svc.name,
          svc.estimatedDuration,
          svc.pricePKR,
          svc.description ?? null,
        ],
      );
    }
  });

  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: AppointmentBooking['status'],
): Promise<AppointmentBooking | null> {
  const result = await query(
    `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, id],
  );

  if (result.rowCount === 0) return null;
  return getBookingById(id);
}

export async function getBookedSlotsForDate(date: string): Promise<string[]> {
  const rows = await queryAll<{ preferred_time: string }>(
    `SELECT preferred_time FROM bookings WHERE preferred_date = $1 AND status != 'cancelled'`,
    [date],
  );
  return rows.map((r) => r.preferred_time);
}

export function createBookingId(): string {
  return 'LM-' + Math.floor(100000 + Math.random() * 900000);
}

export { ADMIN_BOOKINGS_DAYS };

interface BookingRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_date: string;
  preferred_time: string;
  total_price: number;
  subtotal_pkr: number | null;
  discount_percent: number | null;
  discount_pkr: number | null;
  status: AppointmentBooking['status'];
  notes: string | null;
}

async function rowToBooking(row: BookingRow): Promise<AppointmentBooking> {
  const services = await queryAll<{
    service_id: string;
    service_name: string;
    estimated_duration: string;
    price_pkr: number;
    description: string | null;
  }>(
    `SELECT service_id, service_name, estimated_duration, price_pkr, description
     FROM booking_services WHERE booking_id = $1`,
    [row.id],
  );

  const subtotalPrice = row.subtotal_pkr ?? row.total_price;
  const discountPercent = row.discount_percent ?? 0;
  const discountAmount = row.discount_pkr ?? 0;

  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    totalPrice: row.total_price,
    subtotalPrice,
    discountPercent,
    discountAmount,
    isReturningClient: discountPercent > 0,
    status: row.status,
    notes: row.notes ?? undefined,
    selectedServices: services.map((s) => ({
      id: s.service_id,
      name: s.service_name,
      estimatedDuration: s.estimated_duration,
      pricePKR: s.price_pkr,
      description: s.description ?? undefined,
    })),
  };
}
