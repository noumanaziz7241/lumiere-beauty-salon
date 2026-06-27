import { DEFAULT_SALON_CONFIG } from '../../src/config/defaults.ts';
import { queryOne, withTransaction } from './connection.ts';

/** Insert chat + gift voucher config for databases created before v1.2 features. */
export async function ensureExperienceConfigSeeded() {
  const chat = await queryOne<{ id: number }>('SELECT id FROM site_chat WHERE id = 1');
  if (chat) return;

  const { chat: chatConfig, giftVouchers } = DEFAULT_SALON_CONFIG;

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO site_chat (id, enabled, provider, whatsapp_label, tawk_property_id, tawk_widget_id)
       VALUES (1, $1, $2, $3, $4, $5)`,
      [
        chatConfig.enabled,
        chatConfig.provider,
        chatConfig.whatsappLabel,
        chatConfig.tawkPropertyId,
        chatConfig.tawkWidgetId,
      ],
    );

    await client.query(
      `INSERT INTO site_gift_voucher_config (id, enabled, title, subtitle, validity_months)
       VALUES (1, $1, $2, $3, $4)`,
      [
        giftVouchers.enabled,
        giftVouchers.title,
        giftVouchers.subtitle,
        giftVouchers.validityMonths,
      ],
    );

    for (let i = 0; i < giftVouchers.amountsPKR.length; i++) {
      await client.query(
        `INSERT INTO gift_voucher_amounts (amount_pkr, sort_order) VALUES ($1, $2)`,
        [giftVouchers.amountsPKR[i], i],
      );
    }

    for (let i = 0; i < giftVouchers.terms.length; i++) {
      await client.query(
        `INSERT INTO gift_voucher_terms (content, sort_order) VALUES ($1, $2)`,
        [giftVouchers.terms[i], i],
      );
    }
  });
}
