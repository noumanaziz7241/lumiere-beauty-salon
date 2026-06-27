import { randomBytes } from 'crypto';
import type { GiftVoucher } from '../../../src/types.ts';
import { query, queryAll, queryOne } from '../connection.ts';

function generateVoucherCode(): string {
  const segment = randomBytes(3).toString('hex').toUpperCase();
  return `LUM-${segment}`;
}

function mapRow(row: {
  id: string;
  code: string;
  amount_pkr: number;
  purchaser_name: string;
  purchaser_phone: string;
  purchaser_email: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  personal_message: string | null;
  status: GiftVoucher['status'];
  expires_at: Date;
  created_at: Date;
  redeemed_at: Date | null;
}): GiftVoucher {
  return {
    id: row.id,
    code: row.code,
    amountPKR: row.amount_pkr,
    purchaserName: row.purchaser_name,
    purchaserPhone: row.purchaser_phone,
    purchaserEmail: row.purchaser_email,
    recipientName: row.recipient_name,
    recipientEmail: row.recipient_email,
    recipientPhone: row.recipient_phone,
    personalMessage: row.personal_message ?? undefined,
    status: row.status,
    expiresAt: row.expires_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    redeemedAt: row.redeemed_at?.toISOString(),
  };
}

export async function createGiftVoucher(input: {
  amountPKR: number;
  purchaserName: string;
  purchaserPhone: string;
  purchaserEmail?: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  personalMessage?: string;
  validityMonths: number;
}): Promise<GiftVoucher> {
  const id = `gv-${Date.now()}-${randomBytes(4).toString('hex')}`;
  let code = generateVoucherCode();

  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await queryOne('SELECT id FROM gift_vouchers WHERE code = $1', [code]);
    if (!existing) break;
    code = generateVoucherCode();
  }

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + input.validityMonths);

  const result = await queryOne<{
    id: string;
    code: string;
    amount_pkr: number;
    purchaser_name: string;
    purchaser_phone: string;
    purchaser_email: string;
    recipient_name: string;
    recipient_email: string;
    recipient_phone: string;
    personal_message: string | null;
    status: GiftVoucher['status'];
    expires_at: Date;
    created_at: Date;
    redeemed_at: Date | null;
  }>(
    `INSERT INTO gift_vouchers (
      id, code, amount_pkr,
      purchaser_name, purchaser_phone, purchaser_email,
      recipient_name, recipient_email, recipient_phone,
      personal_message, status, expires_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11)
    RETURNING *`,
    [
      id,
      code,
      input.amountPKR,
      input.purchaserName.trim(),
      input.purchaserPhone.trim(),
      input.purchaserEmail?.trim() ?? '',
      input.recipientName.trim(),
      input.recipientEmail?.trim() ?? '',
      input.recipientPhone?.trim() ?? '',
      input.personalMessage?.trim() ?? null,
      expiresAt,
    ],
  );

  if (!result) throw new Error('Failed to create gift voucher');
  return mapRow(result);
}

export async function findVoucherByCode(code: string): Promise<GiftVoucher | null> {
  const row = await queryOne<{
    id: string;
    code: string;
    amount_pkr: number;
    purchaser_name: string;
    purchaser_phone: string;
    purchaser_email: string;
    recipient_name: string;
    recipient_email: string;
    recipient_phone: string;
    personal_message: string | null;
    status: GiftVoucher['status'];
    expires_at: Date;
    created_at: Date;
    redeemed_at: Date | null;
  }>('SELECT * FROM gift_vouchers WHERE UPPER(code) = UPPER($1)', [code.trim()]);

  return row ? mapRow(row) : null;
}

export async function listGiftVouchers(limit = 100): Promise<GiftVoucher[]> {
  const rows = await queryAll<{
    id: string;
    code: string;
    amount_pkr: number;
    purchaser_name: string;
    purchaser_phone: string;
    purchaser_email: string;
    recipient_name: string;
    recipient_email: string;
    recipient_phone: string;
    personal_message: string | null;
    status: GiftVoucher['status'];
    expires_at: Date;
    created_at: Date;
    redeemed_at: Date | null;
  }>(
    `SELECT * FROM gift_vouchers ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );

  return rows.map(mapRow);
}

export async function updateVoucherStatus(
  id: string,
  status: GiftVoucher['status'],
): Promise<GiftVoucher | null> {
  const redeemedAt = status === 'redeemed' ? new Date() : null;

  const row = await queryOne<{
    id: string;
    code: string;
    amount_pkr: number;
    purchaser_name: string;
    purchaser_phone: string;
    purchaser_email: string;
    recipient_name: string;
    recipient_email: string;
    recipient_phone: string;
    personal_message: string | null;
    status: GiftVoucher['status'];
    expires_at: Date;
    created_at: Date;
    redeemed_at: Date | null;
  }>(
    `UPDATE gift_vouchers
     SET status = $2, redeemed_at = COALESCE($3, redeemed_at), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status, redeemedAt],
  );

  return row ? mapRow(row) : null;
}

export async function expireOldVouchers() {
  await query(
    `UPDATE gift_vouchers
     SET status = 'expired', updated_at = NOW()
     WHERE status IN ('pending', 'active') AND expires_at < NOW()`,
  );
}
