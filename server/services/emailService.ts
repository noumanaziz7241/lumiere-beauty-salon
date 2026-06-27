import nodemailer from 'nodemailer';
import type { AppointmentBooking } from '../../src/types.ts';
import type { PublicSalonConfig } from '../../src/config/defaults.ts';

const formatPKR = (amount: number) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);

function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are required for email');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function fromAddress() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@lumierebeauty.pk';
}

function bookingSummaryHtml(booking: AppointmentBooking, salonName = 'Lumière Beauty Salon') {
  const services = booking.selectedServices
    .map((s) => `<li>${s.name} — ${formatPKR(s.pricePKR)}</li>`)
    .join('');

  const discount =
    booking.discountAmount && booking.discountAmount > 0
      ? `<p><strong>Repeat client discount:</strong> −${formatPKR(booking.discountAmount)}</p>`
      : '';

  return `
    <div style="font-family:Inter,sans-serif;color:#501d2c;max-width:560px">
      <h2 style="color:#501d2c">${salonName}</h2>
      <p><strong>Reference:</strong> ${booking.id}</p>
      <p><strong>Client:</strong> ${booking.customerName}</p>
      <p><strong>Phone:</strong> ${booking.customerPhone}</p>
      ${booking.customerEmail ? `<p><strong>Email:</strong> ${booking.customerEmail}</p>` : ''}
      <p><strong>Date:</strong> ${booking.preferredDate}</p>
      <p><strong>Time:</strong> ${booking.preferredTime}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
      <ul>${services}</ul>
      ${discount}
      <p><strong>Total:</strong> ${formatPKR(booking.totalPrice)}</p>
      ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
    </div>
  `;
}

async function sendMail(options: { to: string; subject: string; html: string }) {
  if (!isEmailConfigured()) {
    console.log('[email] Skipped (SMTP not configured):', options.subject, '→', options.to);
    return false;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Lumière Beauty Salon" <${fromAddress()}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
  return true;
}

export async function sendBookingCreatedEmails(
  booking: AppointmentBooking,
  config: PublicSalonConfig,
) {
  const salonEmail = config.contact.email;
  const clientEmail = booking.customerEmail?.trim();

  await Promise.allSettled([
    sendMail({
      to: salonEmail,
      subject: `[New Booking] ${booking.customerName} — ${booking.preferredDate}`,
      html: `
        <h3>New appointment request</h3>
        ${bookingSummaryHtml(booking)}
        <p>Please confirm in the admin portal.</p>
      `,
    }),
    clientEmail
      ? sendMail({
          to: clientEmail,
          subject: `Booking received — ${booking.id}`,
          html: `
            <p>Hi ${booking.customerName},</p>
            <p>Thank you for booking with Lumière Beauty Salon. Your appointment request has been received.</p>
            ${bookingSummaryHtml(booking)}
            <p>We will confirm your slot shortly. Ladies only venue — please arrive 10 minutes early.</p>
          `,
        })
      : Promise.resolve(false),
  ]);
}

export async function sendBookingConfirmedEmail(
  booking: AppointmentBooking,
  config: PublicSalonConfig,
) {
  const clientEmail = booking.customerEmail?.trim();
  if (!clientEmail) return false;

  return sendMail({
    to: clientEmail,
    subject: `Appointment confirmed — ${booking.preferredDate}`,
    html: `
      <p>Hi ${booking.customerName},</p>
      <p>Great news! Your appointment at Lumière Beauty Salon is <strong>confirmed</strong>.</p>
      ${bookingSummaryHtml({ ...booking, status: 'confirmed' })}
      <p>We look forward to seeing you. Ladies only venue — please arrive 10 minutes early.</p>
      <p>Questions? WhatsApp us at ${config.contact.phone}</p>
    `,
  });
}

export { isEmailConfigured };

export async function sendGiftVoucherCreatedEmails(
  voucher: import('../../src/types.ts').GiftVoucher,
  config: PublicSalonConfig,
) {
  const formatPKR = (amount: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);

  const summary = `
    <p><strong>Voucher code:</strong> ${voucher.code}</p>
    <p><strong>Amount:</strong> ${formatPKR(voucher.amountPKR)}</p>
    <p><strong>Recipient:</strong> ${voucher.recipientName}</p>
    <p><strong>Status:</strong> ${voucher.status} (awaiting payment confirmation)</p>
    ${voucher.personalMessage ? `<p><strong>Message:</strong> ${voucher.personalMessage}</p>` : ''}
  `;

  await Promise.allSettled([
    sendMail({
      to: config.contact.email,
      subject: `[Gift Voucher] ${voucher.purchaserName} — ${formatPKR(voucher.amountPKR)}`,
      html: `<h3>New gift voucher request</h3>${summary}<p>Activate in admin after payment is received.</p>`,
    }),
    voucher.purchaserEmail
      ? sendMail({
          to: voucher.purchaserEmail,
          subject: `Gift voucher request received — ${voucher.code}`,
          html: `
            <p>Hi ${voucher.purchaserName},</p>
            <p>Thank you! Your gift voucher request has been received.</p>
            ${summary}
            <p>Our team will confirm payment and activate the voucher shortly. The recipient can use code <strong>${voucher.code}</strong> once active.</p>
          `,
        })
      : Promise.resolve(false),
  ]);
}

export async function sendGiftVoucherActivatedEmail(
  voucher: import('../../src/types.ts').GiftVoucher,
  config: PublicSalonConfig,
) {
  const formatPKR = (amount: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);

  const targets = [voucher.purchaserEmail, voucher.recipientEmail].filter(Boolean) as string[];
  if (targets.length === 0) return false;

  await Promise.allSettled(
    targets.map((to) =>
      sendMail({
        to,
        subject: `Gift voucher active — ${voucher.code}`,
        html: `
          <p>Great news! Gift voucher <strong>${voucher.code}</strong> is now active.</p>
          <p><strong>Value:</strong> ${formatPKR(voucher.amountPKR)}</p>
          <p><strong>For:</strong> ${voucher.recipientName}</p>
          <p>Present this code when booking at Lumière Beauty Salon. Valid until ${new Date(voucher.expiresAt).toLocaleDateString('en-PK')}.</p>
          <p>Questions? WhatsApp us at ${config.contact.phone}</p>
        `,
      }),
    ),
  );
  return true;
}
