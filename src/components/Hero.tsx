import React from 'react';
import { Heart, Sparkles, MessageCircle } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { buildInquiryMessage, buildWhatsAppUrl } from '../lib/whatsapp';
import heroBg from '../assets/images/salon_hero_bg_1780153729412.png';

interface HeroProps {
  onLearnMoreClick: () => void;
  onBookClick: () => void;
}

export default function Hero({ onLearnMoreClick, onBookClick }: HeroProps) {
  const { config } = useSalonConfig();
  const { hero, contact } = config;
  const whatsappLink = buildWhatsAppUrl(contact.whatsapp, buildInquiryMessage());

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-cream"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Luxurious salon interior"
          className="w-full h-full object-cover scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/80 to-cream/60 mix-blend-normal" />
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-rose-light/40 blur-[130px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-gold-light/50 blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-white/70 border border-rose-pale text-rose text-xs uppercase tracking-widest font-bold font-sans mb-6 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose" />
          <span>{hero.bannerText}</span>
        </div>

        <div className="space-y-1 mb-5">
          <span className="text-rose font-serif italic text-base sm:text-lg block tracking-wide">{hero.tagline}</span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest text-burgundy drop-shadow-sm select-none uppercase">
            Lumière
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 sm:w-16 bg-burgundy/30" />
            <h2 className="font-sans text-xs sm:text-sm font-bold tracking-[0.4em] text-burgundy-light uppercase">
              {hero.subtitle}
            </h2>
            <div className="h-[1px] w-10 sm:w-16 bg-burgundy/30" />
          </div>
        </div>

        <p className="font-serif text-lg sm:text-2xl italic text-burgundy font-medium tracking-wide mb-8">
          "{hero.motto}" 💖
        </p>

        <div className="max-w-xl mx-auto card-shimmer backdrop-blur-xl border border-white/70 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden group">
          <div className="absolute -inset-10 bg-gradient-to-r from-rose/15 to-gold/15 rounded-3xl blur-xl group-hover:scale-105 transition-all duration-500" />
          <div className="relative space-y-4">
            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold uppercase text-burgundy tracking-wider">
              {hero.cardTitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm uppercase tracking-widest font-semibold text-rose flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose stroke-rose animate-pulse" />
              {hero.cardSubtitle}
              <Heart className="w-3.5 h-3.5 fill-rose stroke-rose animate-pulse" />
            </p>
            <p className="pt-3 text-burgundy/80 text-xs sm:text-sm font-semibold border-t border-white/50">
              {hero.cardDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-sans uppercase font-extrabold tracking-widest text-xs bg-burgundy hover:bg-burgundy-light text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            Book Appointment
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-sans uppercase font-extrabold tracking-widest text-xs bg-green-600 hover:bg-green-500 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
          <button
            onClick={onLearnMoreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-sans uppercase font-extrabold tracking-widest text-xs bg-white/60 hover:bg-white/90 text-burgundy border border-rose-pale hover:border-rose-light focus:outline-none transition-all duration-300 backdrop-blur cursor-pointer"
          >
            Explore Services
          </button>
        </div>

        <div className="hidden sm:flex flex-col items-center justify-center mt-12 text-[10px] text-burgundy/50 font-sans tracking-[0.2em] uppercase animate-pulse">
          <span>Scroll To Discover</span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose mt-2" />
        </div>
      </div>
    </section>
  );
}
