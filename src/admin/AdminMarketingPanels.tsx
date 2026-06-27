import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import {
  BridalPackage,
  FaqItem,
  GalleryImage,
  GoogleReviewSnippet,
} from '../config/marketingDefaults';
import { SalonConfig } from '../config/defaults';
import { api } from '../api/client';
import type { GiftVoucher } from '../types';

type PanelProps = {
  draft: SalonConfig;
  setDraft: React.Dispatch<React.SetStateAction<SalonConfig>>;
  inputClass: string;
  labelClass: string;
  textareaClass?: string;
};

export function MarketingPanel({ draft, setDraft, inputClass, labelClass }: PanelProps) {
  const { promotion, googleReviews } = draft;

  const updateSnippet = (id: string, patch: Partial<GoogleReviewSnippet>) => {
    setDraft({
      ...draft,
      googleReviews: {
        ...googleReviews,
        snippets: googleReviews.snippets.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      },
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-xl font-black text-burgundy">Promotion banner</h2>
      <label className="flex items-center gap-2 text-sm font-semibold text-burgundy cursor-pointer">
        <input
          type="checkbox"
          checked={promotion.enabled}
          onChange={(e) =>
            setDraft({ ...draft, promotion: { ...promotion, enabled: e.target.checked } })
          }
        />
        Show promotion banner on website
      </label>
      <div className="grid gap-4">
        <div>
          <label className={labelClass}>Promotion message</label>
          <input
            className={inputClass}
            value={promotion.message}
            onChange={(e) => setDraft({ ...draft, promotion: { ...promotion, message: e.target.value } })}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Link URL (#appointment or full URL)</label>
            <input
              className={inputClass}
              value={promotion.linkUrl ?? ''}
              onChange={(e) => setDraft({ ...draft, promotion: { ...promotion, linkUrl: e.target.value } })}
            />
          </div>
          <div>
            <label className={labelClass}>Link label</label>
            <input
              className={inputClass}
              value={promotion.linkLabel ?? ''}
              onChange={(e) => setDraft({ ...draft, promotion: { ...promotion, linkLabel: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <h2 className="font-serif text-xl font-black text-burgundy pt-6 border-t border-rose-pale">
        Google Reviews
      </h2>
      <label className="flex items-center gap-2 text-sm font-semibold text-burgundy cursor-pointer">
        <input
          type="checkbox"
          checked={googleReviews.enabled}
          onChange={(e) =>
            setDraft({ ...draft, googleReviews: { ...googleReviews, enabled: e.target.checked } })
          }
        />
        Show Google reviews section
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Average rating (e.g. 4.9)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            className={inputClass}
            value={googleReviews.averageRating}
            onChange={(e) =>
              setDraft({
                ...draft,
                googleReviews: { ...googleReviews, averageRating: Number(e.target.value) },
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Total review count</label>
          <input
            type="number"
            className={inputClass}
            value={googleReviews.totalReviews}
            onChange={(e) =>
              setDraft({
                ...draft,
                googleReviews: { ...googleReviews, totalReviews: Number(e.target.value) },
              })
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Google reviews page URL</label>
          <input
            className={inputClass}
            value={googleReviews.reviewsUrl}
            onChange={(e) =>
              setDraft({ ...draft, googleReviews: { ...googleReviews, reviewsUrl: e.target.value } })
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Google Maps embed URL (optional)</label>
          <input
            className={inputClass}
            value={googleReviews.embedUrl ?? ''}
            onChange={(e) =>
              setDraft({ ...draft, googleReviews: { ...googleReviews, embedUrl: e.target.value } })
            }
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-burgundy">Featured review snippets</h3>
          <button
            type="button"
            onClick={() =>
              setDraft({
                ...draft,
                googleReviews: {
                  ...googleReviews,
                  snippets: [
                    ...googleReviews.snippets,
                    {
                      id: `gr${Date.now()}`,
                      author: 'Client',
                      text: '',
                      rating: 5,
                    },
                  ],
                },
              })
            }
            className="flex items-center gap-1 text-xs font-bold text-rose cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add snippet
          </button>
        </div>
        {googleReviews.snippets.map((s) => (
          <div key={s.id} className="p-4 rounded-xl border border-rose-pale/50 space-y-2">
            <div className="flex justify-between gap-2">
              <input
                className={inputClass}
                placeholder="Author"
                value={s.author}
                onChange={(e) => updateSnippet(s.id, { author: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    googleReviews: {
                      ...googleReviews,
                      snippets: googleReviews.snippets.filter((x) => x.id !== s.id),
                    },
                  })
                }
                className="p-2 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              className={inputClass + ' min-h-[60px]'}
              placeholder="Review text"
              value={s.text}
              onChange={(e) => updateSnippet(s.id, { text: e.target.value })}
            />
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl font-black text-burgundy pt-6 border-t border-rose-pale">
        Live chat widget
      </h2>
      <label className="flex items-center gap-2 text-sm font-semibold text-burgundy cursor-pointer">
        <input
          type="checkbox"
          checked={draft.chat.enabled}
          onChange={(e) => setDraft({ ...draft, chat: { ...draft.chat, enabled: e.target.checked } })}
        />
        Show floating chat button
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Provider</label>
          <select
            className={inputClass}
            value={draft.chat.provider}
            onChange={(e) =>
              setDraft({
                ...draft,
                chat: { ...draft.chat, provider: e.target.value as 'whatsapp' | 'tawk' },
              })
            }
          >
            <option value="whatsapp">WhatsApp (free)</option>
            <option value="tawk">Tawk.to live chat</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>WhatsApp button label</label>
          <input
            className={inputClass}
            value={draft.chat.whatsappLabel}
            onChange={(e) =>
              setDraft({ ...draft, chat: { ...draft.chat, whatsappLabel: e.target.value } })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Tawk.to Property ID</label>
          <input
            className={inputClass}
            placeholder="e.g. 5f1a2b3c4d5e6f7g8h9i0j"
            value={draft.chat.tawkPropertyId}
            onChange={(e) =>
              setDraft({ ...draft, chat: { ...draft.chat, tawkPropertyId: e.target.value } })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Tawk.to Widget ID</label>
          <input
            className={inputClass}
            placeholder="default"
            value={draft.chat.tawkWidgetId}
            onChange={(e) =>
              setDraft({ ...draft, chat: { ...draft.chat, tawkWidgetId: e.target.value } })
            }
          />
        </div>
      </div>
      <p className="text-xs text-burgundy/60">
        For Tawk.to: sign up at tawk.to, copy Property ID and Widget ID from Administration → Channels → Chat Widget.
      </p>

      <h2 className="font-serif text-xl font-black text-burgundy pt-6 border-t border-rose-pale">
        Gift vouchers (page settings)
      </h2>
      <label className="flex items-center gap-2 text-sm font-semibold text-burgundy cursor-pointer">
        <input
          type="checkbox"
          checked={draft.giftVouchers.enabled}
          onChange={(e) =>
            setDraft({
              ...draft,
              giftVouchers: { ...draft.giftVouchers, enabled: e.target.checked },
            })
          }
        />
        Show gift vouchers section
      </label>
      <div className="grid gap-4">
        <div>
          <label className={labelClass}>Section title</label>
          <input
            className={inputClass}
            value={draft.giftVouchers.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                giftVouchers: { ...draft.giftVouchers, title: e.target.value },
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Subtitle</label>
          <textarea
            className={inputClass + ' min-h-[60px]'}
            value={draft.giftVouchers.subtitle}
            onChange={(e) =>
              setDraft({
                ...draft,
                giftVouchers: { ...draft.giftVouchers, subtitle: e.target.value },
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Preset amounts (PKR, comma-separated)</label>
          <input
            className={inputClass}
            value={draft.giftVouchers.amountsPKR.join(', ')}
            onChange={(e) =>
              setDraft({
                ...draft,
                giftVouchers: {
                  ...draft.giftVouchers,
                  amountsPKR: e.target.value
                    .split(',')
                    .map((v) => parseInt(v.trim(), 10))
                    .filter((n) => !Number.isNaN(n) && n > 0),
                },
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Validity (months)</label>
          <input
            type="number"
            min={1}
            className={inputClass}
            value={draft.giftVouchers.validityMonths}
            onChange={(e) =>
              setDraft({
                ...draft,
                giftVouchers: {
                  ...draft.giftVouchers,
                  validityMonths: Math.max(1, parseInt(e.target.value, 10) || 12),
                },
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Terms (one per line)</label>
          <textarea
            className={inputClass + ' min-h-[100px]'}
            value={draft.giftVouchers.terms.join('\n')}
            onChange={(e) =>
              setDraft({
                ...draft,
                giftVouchers: {
                  ...draft.giftVouchers,
                  terms: e.target.value.split('\n').filter(Boolean),
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function FaqAdminPanel({ draft, setDraft, inputClass, labelClass, textareaClass = inputClass }: PanelProps) {
  const updateFaq = (id: string, patch: Partial<FaqItem>) => {
    setDraft({
      ...draft,
      faq: draft.faq.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">FAQ</h2>
        <button
          type="button"
          onClick={() =>
            setDraft({
              ...draft,
              faq: [
                ...draft.faq,
                { id: `faq${Date.now()}`, question: 'New question?', answer: '', category: 'General' },
              ],
            })
          }
          className="flex items-center gap-1 text-xs font-bold text-rose cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add FAQ
        </button>
      </div>
      {draft.faq.map((item) => (
        <div key={item.id} className="p-4 rounded-xl border border-rose-pale/50 space-y-2">
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Category"
              value={item.category ?? ''}
              onChange={(e) => updateFaq(item.id, { category: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setDraft({ ...draft, faq: draft.faq.filter((f) => f.id !== item.id) })}
              className="p-2 text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            className={inputClass}
            value={item.question}
            onChange={(e) => updateFaq(item.id, { question: e.target.value })}
          />
          <textarea
            className={textareaClass}
            value={item.answer}
            onChange={(e) => updateFaq(item.id, { answer: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

export function GalleryAdminPanel({
  draft,
  setDraft,
  inputClass,
  labelClass,
  savedGallery,
}: PanelProps & { savedGallery: GalleryImage[] }) {
  const [uploading, setUploading] = React.useState(false);
  const hasUnsavedGallery =
    JSON.stringify(draft.gallery) !== JSON.stringify(savedGallery);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadGalleryImage(file);
      setDraft({
        ...draft,
        gallery: [
          ...draft.gallery,
          {
            id: `gal${Date.now()}`,
            title: file.name.replace(/\.[^.]+$/, ''),
            category: 'other',
            imageUrl: url,
          },
        ],
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const updateImage = (id: string, patch: Partial<GalleryImage>) => {
    setDraft({
      ...draft,
      gallery: draft.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">Gallery</h2>
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy text-white text-xs font-bold cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <p className="text-xs text-burgundy/60">Upload JPG/PNG/WebP (max 5MB). Click Save All after editing.</p>
      {hasUnsavedGallery && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 font-semibold">
          Gallery changes are not live yet — click <strong>Save All</strong> in the top bar to apply.
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {draft.gallery.map((img) => (
          <div key={img.id} className="rounded-xl border border-rose-pale/50 overflow-hidden">
            <img src={img.imageUrl} alt={img.title} className="w-full h-32 object-cover bg-rose-pale/30" />
            <div className="p-3 space-y-2">
              <input
                className={inputClass}
                value={img.title}
                onChange={(e) => updateImage(img.id, { title: e.target.value })}
              />
              <select
                className={inputClass}
                value={img.category}
                onChange={(e) =>
                  updateImage(img.id, { category: e.target.value as GalleryImage['category'] })
                }
              >
                {['bridal', 'hair', 'makeup', 'before-after', 'style-refresh', 'salon', 'other'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="Image URL"
                value={img.imageUrl}
                onChange={(e) => updateImage(img.id, { imageUrl: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  setDraft({ ...draft, gallery: draft.gallery.filter((g) => g.id !== img.id) })
                }
                className="text-xs text-red-500 font-bold cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackagesAdminPanel({ draft, setDraft, inputClass, labelClass, textareaClass = inputClass }: PanelProps) {
  const allServices = draft.services.flatMap((c) => c.services);

  const updatePkg = (id: string, patch: Partial<BridalPackage>) => {
    setDraft({
      ...draft,
      packages: draft.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  };

  const toggleService = (pkgId: string, serviceId: string) => {
    const pkg = draft.packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    const has = pkg.serviceIds.includes(serviceId);
    updatePkg(pkgId, {
      serviceIds: has
        ? pkg.serviceIds.filter((id) => id !== serviceId)
        : [...pkg.serviceIds, serviceId],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">Bridal & party packages</h2>
        <button
          type="button"
          onClick={() =>
            setDraft({
              ...draft,
              packages: [
                ...draft.packages,
                {
                  id: `pkg${Date.now()}`,
                  name: 'New package',
                  description: '',
                  badge: 'Special',
                  serviceIds: [],
                },
              ],
            })
          }
          className="flex items-center gap-1 text-xs font-bold text-rose cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add package
        </button>
      </div>
      {draft.packages.map((pkg) => (
        <div key={pkg.id} className="p-4 rounded-xl border border-rose-pale/50 space-y-3">
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={pkg.name}
              onChange={(e) => updatePkg(pkg.id, { name: e.target.value })}
            />
            <select
              className={inputClass + ' w-32'}
              value={pkg.badge}
              onChange={(e) =>
                updatePkg(pkg.id, { badge: e.target.value as BridalPackage['badge'] })
              }
            >
              <option value="Bridal">Bridal</option>
              <option value="Party">Party</option>
              <option value="Special">Special</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setDraft({ ...draft, packages: draft.packages.filter((p) => p.id !== pkg.id) })
              }
              className="p-2 text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            className={textareaClass}
            value={pkg.description}
            onChange={(e) => updatePkg(pkg.id, { description: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Highlight tag (optional)"
            value={pkg.highlight ?? ''}
            onChange={(e) => updatePkg(pkg.id, { highlight: e.target.value })}
          />
          <div>
            <label className={labelClass}>Included services</label>
            <div className="max-h-40 overflow-y-auto border border-rose-pale/50 rounded-xl p-2 space-y-1">
              {allServices.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkg.serviceIds.includes(s.id)}
                    onChange={() => toggleService(pkg.id, s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VouchersAdminPanel() {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getGiftVouchers()
      .then((data) => {
        setVouchers(data.vouchers);
        setError('');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatPKR = (amount: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount);

  const updateStatus = async (id: string, status: GiftVoucher['status']) => {
    try {
      await api.updateGiftVoucherStatus(id, status);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">Gift voucher orders</h2>
        <button type="button" onClick={load} className="text-xs font-bold text-rose cursor-pointer">
          Refresh
        </button>
      </div>
      <p className="text-xs text-burgundy/60">
        Mark vouchers <strong>Active</strong> after payment is received. Use <strong>Redeemed</strong> when used at checkout.
      </p>
      {loading && <p className="text-sm text-burgundy/60">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && vouchers.length === 0 && (
        <p className="text-sm text-burgundy/60">No gift voucher requests yet.</p>
      )}
      <div className="space-y-3">
        {vouchers.map((v) => (
          <div key={v.id} className="p-4 rounded-xl border border-rose-pale/50 space-y-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono font-bold text-burgundy">{v.code}</span>
              <span className="font-bold">{formatPKR(v.amountPKR)}</span>
              <span
                className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                  v.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : v.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-pale text-burgundy/70'
                }`}
              >
                {v.status}
              </span>
            </div>
            <p>
              <strong>From:</strong> {v.purchaserName} ({v.purchaserPhone})
            </p>
            <p>
              <strong>To:</strong> {v.recipientName}
            </p>
            {v.personalMessage && (
              <p className="text-burgundy/70 italic">&ldquo;{v.personalMessage}&rdquo;</p>
            )}
            <p className="text-xs text-burgundy/50">
              Expires {new Date(v.expiresAt).toLocaleDateString('en-PK')}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {v.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => updateStatus(v.id, 'active')}
                    className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Mark paid / Active
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(v.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
              {v.status === 'active' && (
                <button
                  type="button"
                  onClick={() => updateStatus(v.id, 'redeemed')}
                  className="px-3 py-1.5 rounded-lg bg-burgundy text-white text-xs font-bold cursor-pointer"
                >
                  Mark redeemed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
