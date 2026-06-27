import {
  buildBookingNotificationUrls,
  buildBookingWhatsAppMessage,
  buildClientConfirmationMessage,
  buildInquiryMessage,
  buildSalonBookingMessage,
  buildWhatsAppUrl,
  bookingToWhatsAppDetails,
  normalizeWhatsAppNumber,
  type BookingWhatsAppDetails,
  type BookingWhatsAppNotifications,
} from '../../shared/whatsappBooking.ts';

export {
  buildBookingNotificationUrls,
  buildBookingWhatsAppMessage,
  buildClientConfirmationMessage,
  buildInquiryMessage,
  buildSalonBookingMessage,
  buildWhatsAppUrl,
  bookingToWhatsAppDetails,
  normalizeWhatsAppNumber,
  type BookingWhatsAppDetails,
  type BookingWhatsAppNotifications,
};

export function openWhatsApp(phone: string, message?: string): void {
  window.open(buildWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer');
}

export function openWhatsAppUrl(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
