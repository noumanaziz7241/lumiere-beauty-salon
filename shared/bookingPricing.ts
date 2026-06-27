export const REPEAT_CLIENT_DISCOUNT_PERCENT = 10;
export const ADMIN_BOOKINGS_DAYS = 20;

export function normalizePhoneKey(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length >= 12 && digits.startsWith('92')) return digits.slice(-10);
  if (digits.startsWith('0') && digits.length >= 11) return digits.slice(1);
  return digits.slice(-10);
}

export interface BookingPriceBreakdown {
  subtotalPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  isReturningClient: boolean;
}

export function calculateBookingPrice(
  subtotal: number,
  isReturningClient: boolean,
): BookingPriceBreakdown {
  if (!isReturningClient || subtotal <= 0) {
    return {
      subtotalPrice: subtotal,
      discountPercent: 0,
      discountAmount: 0,
      totalPrice: subtotal,
      isReturningClient: false,
    };
  }

  const discountAmount = Math.round(subtotal * (REPEAT_CLIENT_DISCOUNT_PERCENT / 100));
  return {
    subtotalPrice: subtotal,
    discountPercent: REPEAT_CLIENT_DISCOUNT_PERCENT,
    discountAmount,
    totalPrice: Math.max(0, subtotal - discountAmount),
    isReturningClient: true,
  };
}
