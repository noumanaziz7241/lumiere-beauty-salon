export type ChatProvider = 'whatsapp' | 'tawk';

export interface ChatConfig {
  enabled: boolean;
  provider: ChatProvider;
  whatsappLabel: string;
  tawkPropertyId: string;
  tawkWidgetId: string;
}

export interface GiftVoucherConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  validityMonths: number;
  amountsPKR: number[];
  terms: string[];
}

export const DEFAULT_CHAT: ChatConfig = {
  enabled: true,
  provider: 'whatsapp',
  whatsappLabel: 'Book on WhatsApp',
  tawkPropertyId: '',
  tawkWidgetId: '',
};

export const DEFAULT_GIFT_VOUCHERS: GiftVoucherConfig = {
  enabled: true,
  title: 'Gift Vouchers',
  subtitle: 'Treat someone special to a Lumière experience — perfect for birthdays, Eid, and bridal showers.',
  validityMonths: 12,
  amountsPKR: [3000, 5000, 10000, 15000, 25000],
  terms: [
    'Vouchers are valid for ladies-only salon services only.',
    'Payment is confirmed by our team before the voucher code is activated.',
    'Non-refundable; not redeemable for cash.',
    'Present your voucher code when booking or at checkout.',
  ],
};
