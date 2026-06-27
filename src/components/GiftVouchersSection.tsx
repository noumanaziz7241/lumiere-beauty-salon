import React, { useState } from 'react';
import { Gift, Heart, MessageCircle, CheckCircle2, Search } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { api } from '../api/client';
import type { GiftVoucherCreateResponse } from '../types';
import { openWhatsAppUrl } from '../lib/whatsapp';

export default function GiftVouchersSection() {
  const { config } = useSalonConfig();
  const gv = config.giftVouchers;

  const [amount, setAmount] = useState(gv.amountsPKR[1] ?? gv.amountsPKR[0] ?? 5000);
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    message: string;
    amountPKR?: number;
    status?: string;
  } | null>(null);
  const [created, setCreated] = useState<GiftVoucherCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPKR = (value: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(value);

  if (!gv.enabled) return null;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.createGiftVoucher({
        amountPKR: amount,
        purchaserName,
        purchaserPhone,
        purchaserEmail,
        recipientName,
        recipientEmail,
        recipientPhone,
        personalMessage,
      });
      setCreated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyResult(null);
    try {
      const result = await api.verifyGiftVoucher(verifyCode.trim());
      setVerifyResult(result);
    } catch {
      setVerifyResult({ valid: false, message: 'Could not verify voucher' });
    }
  };

  if (created) {
    return (
      <section id="gift-vouchers" className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center card-shimmer backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-extrabold text-burgundy mb-2">Voucher Requested!</h2>
          <p className="text-sm text-burgundy/70 mb-6">
            Your gift voucher code is <strong className="text-burgundy">{created.code}</strong>.
            Complete payment via WhatsApp and our team will activate it for {created.recipientName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => openWhatsAppUrl(created.paymentWhatsAppUrl)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Pay via WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setCreated(null)}
              className="px-6 py-3 rounded-xl border border-rose-pale text-burgundy font-semibold text-sm cursor-pointer"
            >
              Buy another
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gift-vouchers" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-pale border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <Gift className="w-3.5 h-3.5" />
            Gift Cards
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy">{gv.title}</h2>
          <p className="text-burgundy/70 mt-3 max-w-2xl mx-auto text-sm sm:text-base">{gv.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <form
            onSubmit={handlePurchase}
            className="lg:col-span-3 card-shimmer backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 space-y-5"
          >
            <h3 className="font-serif text-lg font-bold text-burgundy flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose" />
              Send a gift voucher
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-burgundy/70">Amount</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {gv.amountsPKR.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border cursor-pointer transition-colors ${
                      amount === preset
                        ? 'bg-burgundy text-white border-burgundy'
                        : 'bg-white/60 text-burgundy border-rose-pale hover:border-rose'
                    }`}
                  >
                    {formatPKR(preset)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-burgundy/70">Your name *</label>
                <input
                  required
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-burgundy/70">Your phone *</label>
                <input
                  required
                  type="tel"
                  value={purchaserPhone}
                  onChange={(e) => setPurchaserPhone(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-burgundy/70">Your email</label>
                <input
                  type="email"
                  value={purchaserEmail}
                  onChange={(e) => setPurchaserEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-burgundy/70">Recipient name *</label>
                <input
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-burgundy/70">Recipient phone</label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-burgundy/70">Recipient email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-burgundy/70">Personal message</label>
                <textarea
                  rows={3}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Happy birthday! Enjoy a pampering day at Lumière..."
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm resize-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-700 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-burgundy hover:bg-burgundy-light text-white font-bold text-sm uppercase tracking-wider cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Submitting…' : `Request ${formatPKR(amount)} voucher`}
            </button>
            <p className="text-[11px] text-burgundy/60 text-center">
              Payment is confirmed offline. Voucher activates after our team verifies payment.
            </p>
          </form>

          <div className="lg:col-span-2 space-y-6">
            <div className="card-shimmer backdrop-blur-xl border border-white/80 rounded-3xl p-6">
              <h3 className="font-serif text-lg font-bold text-burgundy mb-3">Terms</h3>
              <ul className="space-y-2 text-sm text-burgundy/75">
                {gv.terms.map((term) => (
                  <li key={term} className="flex gap-2">
                    <span className="text-rose">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-burgundy/60 mt-4">Valid for {gv.validityMonths} months after activation.</p>
            </div>

            <form
              onSubmit={handleVerify}
              className="card-shimmer backdrop-blur-xl border border-white/80 rounded-3xl p-6"
            >
              <h3 className="font-serif text-lg font-bold text-burgundy mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-rose" />
                Check a voucher
              </h3>
              <input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                placeholder="LUM-ABC123"
                className="w-full px-4 py-3 rounded-xl border border-rose-pale bg-white/70 text-burgundy text-sm font-mono uppercase"
              />
              <button
                type="submit"
                className="mt-3 w-full py-2.5 rounded-xl border border-burgundy text-burgundy font-semibold text-sm cursor-pointer hover:bg-burgundy hover:text-white transition-colors"
              >
                Verify code
              </button>
              {verifyResult && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    verifyResult.valid ? 'text-green-700' : 'text-burgundy/70'
                  }`}
                >
                  {verifyResult.message}
                  {verifyResult.amountPKR ? ` (${formatPKR(verifyResult.amountPKR)})` : ''}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
