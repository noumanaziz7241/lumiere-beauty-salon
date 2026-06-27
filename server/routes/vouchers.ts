import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import { getPublicConfig } from '../store/index.ts';
import {
  createGiftVoucher,
  findVoucherByCode,
  listGiftVouchers,
  updateVoucherStatus,
  expireOldVouchers,
} from '../db/repositories/voucherRepository.ts';
import { buildWhatsAppUrl } from '../../shared/whatsappBooking.ts';
import {
  sendGiftVoucherActivatedEmail,
  sendGiftVoucherCreatedEmails,
} from '../services/emailService.ts';
import type { GiftVoucherCreateResponse } from '../../src/types.ts';

const router = Router();

function formatPKR(amount: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

router.get('/verify', async (req, res, next) => {
  try {
    const code = (req.query.code as string)?.trim();
    if (!code) {
      res.status(400).json({ error: 'Voucher code is required' });
      return;
    }

    await expireOldVouchers();
    const voucher = await findVoucherByCode(code);
    if (!voucher) {
      res.json({ valid: false, message: 'Voucher not found' });
      return;
    }

    const expired = new Date(voucher.expiresAt) < new Date();
    const usable = voucher.status === 'active' && !expired;

    res.json({
      valid: usable,
      code: voucher.code,
      amountPKR: voucher.amountPKR,
      status: expired && voucher.status !== 'redeemed' ? 'expired' : voucher.status,
      recipientName: voucher.recipientName,
      expiresAt: voucher.expiresAt,
      message: usable
        ? `Active voucher worth ${formatPKR(voucher.amountPKR)}`
        : voucher.status === 'pending'
          ? 'Awaiting payment confirmation'
          : voucher.status === 'redeemed'
            ? 'This voucher has already been used'
            : expired
              ? 'This voucher has expired'
              : 'Voucher is not active',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const config = await getPublicConfig();

    if (!config.giftVouchers.enabled) {
      res.status(403).json({ error: 'Gift vouchers are not available at this time' });
      return;
    }

    const {
      amountPKR,
      purchaserName,
      purchaserPhone,
      purchaserEmail,
      recipientName,
      recipientEmail,
      recipientPhone,
      personalMessage,
    } = req.body as Record<string, unknown>;

    const amount = Number(amountPKR);
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Select a valid voucher amount' });
      return;
    }

    if (!config.giftVouchers.amountsPKR.includes(amount)) {
      res.status(400).json({ error: 'Invalid voucher amount' });
      return;
    }

    if (!purchaserName || !purchaserPhone || !recipientName) {
      res.status(400).json({ error: 'Purchaser and recipient names and phone are required' });
      return;
    }

    const voucher = await createGiftVoucher({
      amountPKR: amount,
      purchaserName: String(purchaserName),
      purchaserPhone: String(purchaserPhone),
      purchaserEmail: purchaserEmail ? String(purchaserEmail) : undefined,
      recipientName: String(recipientName),
      recipientEmail: recipientEmail ? String(recipientEmail) : undefined,
      recipientPhone: recipientPhone ? String(recipientPhone) : undefined,
      personalMessage: personalMessage ? String(personalMessage) : undefined,
      validityMonths: config.giftVouchers.validityMonths,
    });

    await sendGiftVoucherCreatedEmails(voucher, config);

    const paymentMessage = [
      `Hi! I'd like to purchase a Lumière gift voucher.`,
      ``,
      `Code: ${voucher.code}`,
      `Amount: ${formatPKR(voucher.amountPKR)}`,
      `Purchaser: ${voucher.purchaserName} (${voucher.purchaserPhone})`,
      `Recipient: ${voucher.recipientName}`,
      voucher.personalMessage ? `Message: ${voucher.personalMessage}` : '',
      ``,
      `Please confirm payment instructions. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const response: GiftVoucherCreateResponse = {
      ...voucher,
      paymentWhatsAppUrl: buildWhatsAppUrl(config.contact.whatsapp, paymentMessage),
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    await expireOldVouchers();
    const vouchers = await listGiftVouchers();
    res.json({ vouchers });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.body as { status?: string };
    const allowed = ['pending', 'active', 'redeemed', 'expired', 'cancelled'] as const;

    if (!status || !allowed.includes(status as (typeof allowed)[number])) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const config = await getPublicConfig();
    const previous = (await listGiftVouchers()).find((v) => v.id === req.params.id);
    const voucher = await updateVoucherStatus(req.params.id, status as (typeof allowed)[number]);

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    if (status === 'active' && previous?.status !== 'active') {
      await sendGiftVoucherActivatedEmail(voucher, config);
    }

    res.json(voucher);
  } catch (error) {
    next(error);
  }
});

export default router;
