import React from 'react';
import { Clock, ShieldCheck, Heart, Sparkles, ChevronUp, MessageCircle } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { buildInquiryMessage, buildWhatsAppUrl } from '../lib/whatsapp';

interface ContactFooterProps {
  onBackToTop: () => void;
}

export default function ContactFooter({ onBackToTop }: ContactFooterProps) {
  const { config } = useSalonConfig();
  const { contact, footer, businessHours, hoursNote } = config;
  const currentYear = new Date().getFullYear();
  const whatsappLink = buildWhatsAppUrl(contact.whatsapp, buildInquiryMessage());

  return (
    <footer id="hours" className="bg-burgundy border-t border-burgundy-dark text-rose-pale relative">
      <button
        onClick={onBackToTop}
        className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white hover:bg-rose-pale border border-rose-pale text-burgundy flex items-center justify-center transition-all cursor-pointer shadow-md"
        title="Scroll back to top"
      >
        <ChevronUp className="w-5 h-5 animate-bounce" />
      </button>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-burgundy-dark">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose to-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-black tracking-widest text-cream">
                LUMIÈRE BEAUTY SALON
              </span>
            </div>
            <p className="font-sans text-xs text-rose-pale/80 leading-relaxed max-w-xs font-semibold">
              {footer.description}
            </p>
            <div className="pt-2 text-[11px] font-sans text-white font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/10 border border-rose/20 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-rose-light" />
              <span>Strictly Ladies Only Venue</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-xs font-bold text-rose-light uppercase tracking-widest">Business hours</h4>
            <div className="w-10 h-0.5 bg-rose/40" />
            <div className="space-y-3 font-sans text-xs text-rose-pale/80">
              {businessHours.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-rose-light shrink-0 mt-0.5" />
                  <div className="flex justify-between w-full max-w-xs">
                    <span className={`font-semibold ${h.closed ? 'text-rose-light/70' : 'text-cream'}`}>{h.days}:</span>
                    <span className={h.closed ? 'uppercase text-[10px] font-bold text-rose-light' : ''}>{h.hours}</span>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-rose-light/50 leading-relaxed italic pl-6 max-w-xs">
                *{hoursNote}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-xs font-bold text-rose-light uppercase tracking-widest">Quick Contact</h4>
            <div className="w-10 h-0.5 bg-rose/40" />
            <div className="space-y-2 font-sans text-xs">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="block text-rose-pale/80 hover:text-white transition-colors">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block text-rose-pale/80 hover:text-white transition-colors">
                {contact.email}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-burgundy-dark py-10 text-center space-y-4 px-4 border-t border-burgundy-deep">
        <p className="font-serif text-lg italic text-cream flex items-center justify-center gap-1.5">
          "{footer.slogan}"
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-rose-pale font-extrabold flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-rose stroke-rose animate-pulse" />
          {footer.tagline}
          <Heart className="w-3.5 h-3.5 fill-rose stroke-rose animate-pulse" />
        </p>
        <div className="text-[10px] text-rose-light/40 font-semibold font-sans pt-4 max-w-sm mx-auto border-t border-rose/10 space-y-1">
          <p>© {currentYear} Lumière Beauty Salon. All rights reserved.</p>
          <p>
            <a href="/admin" className="hover:text-rose-light/70 transition-colors">Admin Portal</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
