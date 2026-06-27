import type { AppointmentBooking, Service } from '../src/types.ts';

export const SALON_NAME = 'Lumière Beauty Salon';

export interface BookingWhatsAppDetails {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredDate: string;
  preferredTime: string;
  selectedServices: Service[];
  totalPrice: number;
  subtotalPrice?: number;
  discountPercent?: number;
  discountAmount?: number;
  notes?: string;
  bookingId?: string;
  status?: AppointmentBooking['status'];
}

function formatPriceLines(details: BookingWhatsAppDetails): string[] {
  const subtotal = details.subtotalPrice ?? details.totalPrice;
  const lines: string[] = [];

  if (details.discountAmount && details.discountAmount > 0) {
    lines.push(
      `Subtotal: ${formatPKR(subtotal)}`,
      `Repeat client discount (${details.discountPercent ?? 10}%): -${formatPKR(details.discountAmount)}`,
      `Estimated total: ${formatPKR(details.totalPrice)}`,
    );
  } else {
    lines.push(`Estimated total: ${formatPKR(details.totalPrice)}`);
  }

  return lines;
}

export interface BookingWhatsAppNotifications {
  salonUrl: string;
  clientUrl: string;
  salonMessage: string;
  clientMessage: string;
}

export function normalizeWhatsAppNumber(phone: string, defaultCountryCode = '92'): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length >= 11 && digits.startsWith(defaultCountryCode)) return digits;
  if (digits.startsWith('0')) return `${defaultCountryCode}${digits.slice(1)}`;
  if (digits.length === 10) return `${defaultCountryCode}${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return 'https://wa.me/';

  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;

  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function buildInquiryMessage(): string {
  return [
    `Hello ${SALON_NAME}!`,
    '',
    'I would like to book an appointment at your ladies-only salon.',
    '',
    'Could you please share your available slots?',
    '',
    'Thank you!',
  ].join('\n');
}

export function buildSalonBookingMessage(details: BookingWhatsAppDetails): string {
  const serviceLines = details.selectedServices.map(
    (service) => `• ${service.name} — ${formatPKR(service.pricePKR)}`,
  );

  const lines = [
    `[New Booking] ${SALON_NAME}`,
    '',
    'A client submitted an appointment request:',
    '',
  ];

  if (details.bookingId) {
    lines.push(`Reference: ${details.bookingId}`);
  }

  lines.push(
    `Name: ${details.customerName}`,
    `Phone: ${details.customerPhone}`,
  );

  if (details.customerEmail?.trim()) {
    lines.push(`Email: ${details.customerEmail.trim()}`);
  }

  lines.push(
    '',
    `Date: ${formatDisplayDate(details.preferredDate)}`,
    `Time: ${details.preferredTime}`,
    '',
    'Services:',
    ...serviceLines,
    '',
    ...formatPriceLines(details),
  );

  if (details.notes?.trim()) {
    lines.push('', `Notes: ${details.notes.trim()}`);
  }

  lines.push('', 'Please confirm this appointment. Thank you!');

  return lines.join('\n');
}

/** Message the client saves on their own WhatsApp (message yourself). */
export function buildClientConfirmationMessage(details: BookingWhatsAppDetails): string {
  const serviceLines = details.selectedServices.map(
    (service) => `• ${service.name} — ${formatPKR(service.pricePKR)}`,
  );

  const lines = [
    `Your ${SALON_NAME} appointment`,
    '',
  ];

  if (details.bookingId) {
    lines.push(`Reference: ${details.bookingId}`);
  }

  lines.push(
    `Name: ${details.customerName}`,
    `Date: ${formatDisplayDate(details.preferredDate)}`,
    `Time: ${details.preferredTime}`,
    '',
    'Services:',
    ...serviceLines,
    '',
    ...formatPriceLines(details).map((line) =>
      line.startsWith('Estimated total') ? line.replace('Estimated total', 'Total') : line,
    ),
    `Status: ${details.status ?? 'pending'} (awaiting salon confirmation)`,
    '',
    'Ladies Only venue — please arrive 10 minutes early.',
    '',
    'Save this message for your records.',
  );

  return lines.join('\n');
}

/** @deprecated Use buildSalonBookingMessage — kept for existing imports */
export function buildBookingWhatsAppMessage(details: BookingWhatsAppDetails): string {
  return buildSalonBookingMessage(details);
}

export function bookingToWhatsAppDetails(booking: AppointmentBooking): BookingWhatsAppDetails {
  return {
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
    selectedServices: booking.selectedServices,
    totalPrice: booking.totalPrice,
    subtotalPrice: booking.subtotalPrice,
    discountPercent: booking.discountPercent,
    discountAmount: booking.discountAmount,
    notes: booking.notes,
    bookingId: booking.id,
    status: booking.status,
  };
}

export function buildBookingNotificationUrls(
  salonWhatsApp: string,
  details: BookingWhatsAppDetails,
): BookingWhatsAppNotifications {
  const clientPhone = normalizeWhatsAppNumber(details.customerPhone);
  const salonMessage = buildSalonBookingMessage(details);
  const clientMessage = buildClientConfirmationMessage(details);

  return {
    salonUrl: buildWhatsAppUrl(salonWhatsApp, salonMessage),
    clientUrl: buildWhatsAppUrl(clientPhone, clientMessage),
    salonMessage,
    clientMessage,
  };
}
