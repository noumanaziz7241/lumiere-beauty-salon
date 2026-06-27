import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { buildInquiryMessage, buildWhatsAppUrl } from '../lib/whatsapp';

export default function ContactSection() {
  const { config } = useSalonConfig();
  const { contact, social } = config;

  const whatsappLink = buildWhatsAppUrl(contact.whatsapp, buildInquiryMessage());

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-cream to-cream-warm border-t border-rose-pale/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
            Get In Touch
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">
            Visit or Reach Us
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="card-shimmer backdrop-blur-xl border border-white/80 p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-xl hover:border-green-300/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-serif text-sm font-bold text-burgundy mb-1">WhatsApp</h3>
              <p className="font-mono text-xs text-burgundy/70">{contact.phone}</p>
              <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-green-600">
                Chat Now →
              </span>
            </a>

            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="card-shimmer backdrop-blur-xl border border-white/80 p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-xl hover:border-rose-light/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-rose/10 border border-rose/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-rose" />
              </div>
              <h3 className="font-serif text-sm font-bold text-burgundy mb-1">Call Us</h3>
              <p className="font-mono text-xs text-burgundy/70">{contact.phone}</p>
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="card-shimmer backdrop-blur-xl border border-white/80 p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-xl hover:border-gold/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-sm font-bold text-burgundy mb-1">Email</h3>
              <p className="font-sans text-xs text-burgundy/70 break-all">{contact.email}</p>
            </a>

            <div className="card-shimmer backdrop-blur-xl border border-white/80 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-burgundy/10 border border-burgundy/20 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-burgundy" />
              </div>
              <h3 className="font-serif text-sm font-bold text-burgundy mb-1">Location</h3>
              <p className="font-sans text-xs text-burgundy/70 leading-relaxed">
                {contact.address}
                <br />
                {contact.city}
              </p>
            </div>
          </div>

          {/* Map + Social */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-rose-pale/50 shadow-lg h-64 lg:h-full min-h-[250px]">
              <iframe
                src={contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '250px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salon location map"
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-burgundy-dark flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md text-xs font-bold"
                  title="TikTok"
                >
                  TT
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
