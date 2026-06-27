import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, LogOut, Settings, Phone, FileText, Scissors,
  Star, Clock, Save, RotateCcw, Plus, Trash2, Home, CalendarCheck,
  Megaphone, HelpCircle, Images, Gift, Ticket,
} from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { SalonConfig, Testimonial, BusinessHours } from '../config/defaults';
import { ServiceCategory, Service, AppointmentBooking } from '../types';
import { api } from '../api/client';
import {
  MarketingPanel,
  FaqAdminPanel,
  GalleryAdminPanel,
  PackagesAdminPanel,
  VouchersAdminPanel,
} from './AdminMarketingPanels';

type Tab =
  | 'contact'
  | 'content'
  | 'services'
  | 'testimonials'
  | 'marketing'
  | 'faq'
  | 'gallery'
  | 'packages'
  | 'vouchers'
  | 'hours'
  | 'bookings'
  | 'settings';

export default function AdminDashboard() {
  const { config, updateConfig, resetConfig, isAdmin, logout } = useSalonConfig();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [draft, setDraft] = useState<SalonConfig>(config);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  React.useEffect(() => {
    if (!isAdmin) navigate('/admin');
  }, [isAdmin, navigate]);

  React.useEffect(() => {
    setDraft(config);
  }, [config]);

  const handleSave = async () => {
    setSaveError('');
    try {
      await updateConfig(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'packages', label: 'Packages', icon: Gift },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-rose-pale bg-white font-sans text-sm text-burgundy focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose';
  const labelClass = 'block font-sans text-[11px] font-bold text-burgundy/70 uppercase tracking-wider mb-1.5';
  const textareaClass = inputClass + ' resize-y min-h-[80px]';

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-burgundy text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose to-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-black">Lumière Admin</h1>
              <p className="text-[10px] text-rose-pale/70 uppercase tracking-widest">Content Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-pale hover:bg-white/10 transition-colors">
              <Home className="w-3.5 h-3.5" /> View Site
            </a>
            {saveError && (
              <span className="text-[10px] text-red-300 font-semibold hidden sm:inline">{saveError}</span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose hover:bg-rose-light text-white transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saved ? 'Saved!' : 'Save All'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-pale/80 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <nav className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-burgundy text-white shadow-md'
                        : 'text-burgundy/70 hover:bg-rose-pale/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Panel content */}
          <div className="flex-1 bg-white rounded-2xl border border-rose-pale/50 shadow-sm p-6 sm:p-8">
            {activeTab === 'contact' && (
              <ContactPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} />
            )}
            {activeTab === 'content' && (
              <ContentPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} textareaClass={textareaClass} />
            )}
            {activeTab === 'marketing' && (
              <MarketingPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} />
            )}
            {activeTab === 'faq' && (
              <FaqAdminPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} textareaClass={textareaClass} />
            )}
            {activeTab === 'gallery' && (
              <GalleryAdminPanel
                draft={draft}
                setDraft={setDraft}
                inputClass={inputClass}
                labelClass={labelClass}
                savedGallery={config.gallery}
              />
            )}
            {activeTab === 'packages' && (
              <PackagesAdminPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} textareaClass={textareaClass} />
            )}
            {activeTab === 'vouchers' && <VouchersAdminPanel />}
            {activeTab === 'services' && (
              <ServicesPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} />
            )}
            {activeTab === 'testimonials' && (
              <TestimonialsPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} textareaClass={textareaClass} />
            )}
            {activeTab === 'hours' && (
              <HoursPanel draft={draft} setDraft={setDraft} inputClass={inputClass} labelClass={labelClass} />
            )}
            {activeTab === 'bookings' && (
              <BookingsPanel labelClass={labelClass} inputClass={inputClass} />
            )}
            {activeTab === 'settings' && (
              <SettingsPanel resetConfig={resetConfig} inputClass={inputClass} labelClass={labelClass} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-panels ---- */

function ContactPanel({ draft, setDraft, inputClass, labelClass }: PanelProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-black text-burgundy">Contact Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {([
          ['phone', 'Phone Number'],
          ['whatsapp', 'WhatsApp Number (digits only, e.g. 923001234567)'],
          ['email', 'Email Address'],
          ['address', 'Street Address'],
          ['city', 'City / Region'],
        ] as const).map(([key, label]) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input
              className={inputClass}
              value={draft.contact[key]}
              onChange={(e) =>
                setDraft({ ...draft, contact: { ...draft.contact, [key]: e.target.value } })
              }
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className={labelClass}>Google Maps Embed URL</label>
          <input
            className={inputClass}
            value={draft.contact.mapEmbedUrl}
            onChange={(e) =>
              setDraft({ ...draft, contact: { ...draft.contact, mapEmbedUrl: e.target.value } })
            }
          />
        </div>
      </div>

      <h3 className="font-serif text-lg font-bold text-burgundy pt-4 border-t border-rose-pale">Social Media</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['instagram', 'facebook', 'tiktok'] as const).map((key) => (
          <div key={key}>
            <label className={labelClass}>{key.charAt(0).toUpperCase() + key.slice(1)} URL</label>
            <input
              className={inputClass}
              value={draft.social[key]}
              onChange={(e) =>
                setDraft({ ...draft, social: { ...draft.social, [key]: e.target.value } })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentPanel({ draft, setDraft, inputClass, labelClass, textareaClass }: PanelProps & { textareaClass: string }) {
  const updateHero = (key: string, value: string) =>
    setDraft({ ...draft, hero: { ...draft.hero, [key]: value } });
  const updateAbout = (key: string, value: string | string[]) =>
    setDraft({ ...draft, about: { ...draft.about, [key]: value } });
  const updateFooter = (key: string, value: string) =>
    setDraft({ ...draft, footer: { ...draft.footer, [key]: value } });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-black text-burgundy mb-4">Hero Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            ['tagline', 'Tagline'],
            ['subtitle', 'Subtitle'],
            ['motto', 'Motto'],
            ['bannerText', 'Banner Text'],
            ['cardTitle', 'Card Title'],
            ['cardSubtitle', 'Card Subtitle'],
            ['cardDescription', 'Card Description'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input className={inputClass} value={draft.hero[key]} onChange={(e) => updateHero(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-black text-burgundy mb-4">About Section</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} value={draft.about.title} onChange={(e) => updateAbout('title', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input className={inputClass} value={draft.about.subtitle} onChange={(e) => updateAbout('subtitle', e.target.value)} />
            </div>
          </div>
          {draft.about.paragraphs.map((p, i) => (
            <div key={i}>
              <label className={labelClass}>Paragraph {i + 1}</label>
              <textarea
                className={textareaClass}
                value={p}
                onChange={(e) => {
                  const paragraphs = [...draft.about.paragraphs];
                  paragraphs[i] = e.target.value;
                  updateAbout('paragraphs', paragraphs);
                }}
              />
            </div>
          ))}
          {draft.about.highlights.map((h, i) => (
            <div key={i}>
              <label className={labelClass}>Highlight {i + 1}</label>
              <input
                className={inputClass}
                value={h}
                onChange={(e) => {
                  const highlights = [...draft.about.highlights];
                  highlights[i] = e.target.value;
                  updateAbout('highlights', highlights);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-black text-burgundy mb-4">Footer & Navbar</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Navbar Banner</label>
            <input className={inputClass} value={draft.navbar.bannerText} onChange={(e) => setDraft({ ...draft, navbar: { bannerText: e.target.value } })} />
          </div>
          <div>
            <label className={labelClass}>Footer Description</label>
            <textarea className={textareaClass} value={draft.footer.description} onChange={(e) => updateFooter('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slogan</label>
              <input className={inputClass} value={draft.footer.slogan} onChange={(e) => updateFooter('slogan', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input className={inputClass} value={draft.footer.tagline} onChange={(e) => updateFooter('tagline', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl font-black text-burgundy mb-4">Core Promises</h2>
        {draft.corePromises.map((promise, i) => (
          <div key={i} className="mb-4 p-4 rounded-xl border border-rose-pale/50 bg-cream/30">
            <label className={labelClass}>Title</label>
            <input
              className={inputClass + ' mb-2'}
              value={promise.title}
              onChange={(e) => {
                const corePromises = [...draft.corePromises];
                corePromises[i] = { ...corePromises[i], title: e.target.value };
                setDraft({ ...draft, corePromises });
              }}
            />
            <label className={labelClass}>Description</label>
            <textarea
              className={textareaClass}
              value={promise.description}
              onChange={(e) => {
                const corePromises = [...draft.corePromises];
                corePromises[i] = { ...corePromises[i], description: e.target.value };
                setDraft({ ...draft, corePromises });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesPanel({ draft, setDraft, inputClass, labelClass }: PanelProps) {
  const updateService = (catIdx: number, svcIdx: number, field: keyof Service, value: string | number) => {
    const services = JSON.parse(JSON.stringify(draft.services)) as ServiceCategory[];
    const svc = services[catIdx].services[svcIdx];
    if (field === 'pricePKR') svc.pricePKR = value as number;
    else if (field === 'name') svc.name = value as string;
    else if (field === 'estimatedDuration') svc.estimatedDuration = value as string;
    else if (field === 'description') svc.description = value as string;
    setDraft({ ...draft, services });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-black text-burgundy">Service Catalog</h2>
      <p className="font-sans text-xs text-burgundy/60">Edit prices, names, and descriptions. Changes appear on the public site after saving.</p>
      {draft.services.map((cat, catIdx) => (
        <div key={cat.id} className="border border-rose-pale/50 rounded-xl overflow-hidden">
          <div className="bg-burgundy/5 px-4 py-3 border-b border-rose-pale/50">
            <h3 className="font-serif text-sm font-bold text-burgundy">{cat.name}</h3>
            <p className="font-sans text-[10px] text-burgundy/50">{cat.services.length} services</p>
          </div>
          <div className="divide-y divide-rose-pale/30">
            {cat.services.map((svc, svcIdx) => (
              <div key={svc.id} className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input className={inputClass} value={svc.name} onChange={(e) => updateService(catIdx, svcIdx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Price (PKR)</label>
                  <input className={inputClass} type="number" value={svc.pricePKR} onChange={(e) => updateService(catIdx, svcIdx, 'pricePKR', Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input className={inputClass} value={svc.estimatedDuration} onChange={(e) => updateService(catIdx, svcIdx, 'estimatedDuration', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input className={inputClass} value={svc.description || ''} onChange={(e) => updateService(catIdx, svcIdx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsPanel({ draft, setDraft, inputClass, labelClass, textareaClass }: PanelProps & { textareaClass: string }) {
  const addTestimonial = () => {
    const newT: Testimonial = { id: `t${Date.now()}`, name: '', text: '', rating: 5, service: '' };
    setDraft({ ...draft, testimonials: [...draft.testimonials, newT] });
  };

  const removeTestimonial = (id: string) => {
    setDraft({ ...draft, testimonials: draft.testimonials.filter((t) => t.id !== id) });
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setDraft({
      ...draft,
      testimonials: draft.testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">Testimonials</h2>
        <button onClick={addTestimonial} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-rose text-white hover:bg-rose-light transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Review
        </button>
      </div>
      {draft.testimonials.map((t) => (
        <div key={t.id} className="p-4 rounded-xl border border-rose-pale/50 bg-cream/30 space-y-3">
          <div className="flex justify-between items-start">
            <span className="font-sans text-[10px] font-bold text-burgundy/40 uppercase">Review</span>
            <button onClick={() => removeTestimonial(t.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={t.name} onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Service</label>
              <input className={inputClass} value={t.service || ''} onChange={(e) => updateTestimonial(t.id, 'service', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Rating (1-5)</label>
              <input className={inputClass} type="number" min={1} max={5} value={t.rating} onChange={(e) => updateTestimonial(t.id, 'rating', Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Review Text</label>
            <textarea className={textareaClass} value={t.text} onChange={(e) => updateTestimonial(t.id, 'text', e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HoursPanel({ draft, setDraft, inputClass, labelClass }: PanelProps) {
  const updateHour = (idx: number, field: keyof BusinessHours, value: string | boolean) => {
    const businessHours = [...draft.businessHours];
    businessHours[idx] = { ...businessHours[idx], [field]: value };
    setDraft({ ...draft, businessHours });
  };

  const addHour = () => {
    setDraft({ ...draft, businessHours: [...draft.businessHours, { days: '', hours: '' }] });
  };

  const removeHour = (idx: number) => {
    setDraft({ ...draft, businessHours: draft.businessHours.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-black text-burgundy">Business Hours</h2>
        <button onClick={addHour} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-rose text-white hover:bg-rose-light transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Row
        </button>
      </div>
      {draft.businessHours.map((h, i) => (
        <div key={i} className="flex items-end gap-3">
          <div className="flex-1">
            <label className={labelClass}>Days</label>
            <input className={inputClass} value={h.days} onChange={(e) => updateHour(i, 'days', e.target.value)} />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Hours</label>
            <input className={inputClass} value={h.hours} onChange={(e) => updateHour(i, 'hours', e.target.value)} />
          </div>
          <label className="flex items-center gap-1.5 pb-2.5 font-sans text-xs text-burgundy/60">
            <input type="checkbox" checked={!!h.closed} onChange={(e) => updateHour(i, 'closed', e.target.checked)} />
            Closed
          </label>
          <button onClick={() => removeHour(i)} className="pb-2.5 text-red-400 hover:text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div>
        <label className={labelClass}>Hours Note (footer)</label>
        <input className={inputClass} value={draft.hoursNote} onChange={(e) => setDraft({ ...draft, hoursNote: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>Booking Time Slots (comma-separated)</label>
        <input
          className={inputClass}
          value={draft.timeSlots.join(', ')}
          onChange={(e) =>
            setDraft({ ...draft, timeSlots: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
          }
        />
      </div>
    </div>
  );
}

function SettingsPanel({ resetConfig, inputClass, labelClass }: { resetConfig: () => Promise<void>; inputClass: string; labelClass: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handlePasswordChange = async () => {
    setPasswordMsg('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-black text-burgundy">Admin Settings</h2>
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Current Password</label>
          <input className={inputClass} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>New Password (min 6 characters)</label>
          <input className={inputClass} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-burgundy text-white hover:bg-burgundy-light transition-colors cursor-pointer"
        >
          Update Password
        </button>
        {passwordMsg && <p className="text-xs font-semibold text-burgundy/70">{passwordMsg}</p>}
      </div>
      <div className="pt-6 border-t border-rose-pale">
        <h3 className="font-serif text-lg font-bold text-burgundy mb-2">Danger Zone</h3>
        <p className="font-sans text-xs text-burgundy/60 mb-3">Reset all content back to factory defaults. This cannot be undone.</p>
        <button
          onClick={async () => {
            if (confirm('Reset all salon content to defaults? This cannot be undone.')) {
              await resetConfig();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}

function BookingsPanel({ labelClass, inputClass }: { labelClass: string; inputClass: string }) {
  const [bookings, setBookings] = useState<AppointmentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [daysWindow, setDaysWindow] = useState(20);

  const loadBookings = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getBookings({
        status: filterStatus || undefined,
        daysBack: 20,
      });
      setBookings(data.bookings);
      setDaysWindow(data.daysBack);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  React.useEffect(() => { loadBookings(); }, [loadBookings]);

  const updateStatus = async (id: string, status: AppointmentBooking['status']) => {
    await api.updateBookingStatus(id, status);
    loadBookings();
  };

  const formatPKR = (n: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-black text-burgundy">Appointments</h2>
          <p className="text-[11px] text-burgundy/60 font-sans mt-1">
            Showing appointments from the last {daysWindow} days (by date). Older records stay in the database.
          </p>
        </div>
        <select
          className={inputClass + ' w-auto text-xs'}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-burgundy/50">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-burgundy/50">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-rose-pale/50 bg-cream/30 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif font-bold text-burgundy">{b.customerName}</p>
                  <p className="font-mono text-xs text-burgundy/60">{b.id}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                  'bg-amber-100 text-amber-700'
                }`}>{b.status}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-burgundy/70">
                <span>{b.preferredDate}</span>
                <span>{b.preferredTime}</span>
                <span>{b.customerPhone}</span>
                <span className="font-bold">{formatPKR(b.totalPrice)}</span>
              </div>
              {b.discountAmount != null && b.discountAmount > 0 && (
                <p className="text-[10px] font-semibold text-green-700">
                  Repeat client: {b.discountPercent}% off (−{formatPKR(b.discountAmount)})
                </p>
              )}
              <p className="text-[10px] text-burgundy/50">
                {b.selectedServices.map((s) => s.name).join(', ')}
              </p>
              <div className="flex gap-2 pt-1">
                {b.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-3 py-1 rounded-lg text-[10px] font-bold bg-green-600 text-white cursor-pointer">Confirm</button>
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-200 text-gray-700 cursor-pointer">Cancel</button>
                  </>
                )}
                {b.status === 'confirmed' && (
                  <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1 rounded-lg text-[10px] font-bold bg-gray-200 text-gray-700 cursor-pointer">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PanelProps {
  draft: SalonConfig;
  setDraft: React.Dispatch<React.SetStateAction<SalonConfig>>;
  inputClass: string;
  labelClass: string;
}
