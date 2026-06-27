import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function Testimonials() {
  const { config } = useSalonConfig();
  const { testimonials } = config;

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-cream-warm to-cream border-t border-rose-pale/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
            Client Love
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">
            What Our Guests Say
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative card-shimmer backdrop-blur-xl border border-white/80 p-6 rounded-2xl flex flex-col hover:shadow-xl hover:border-rose-light/40 transition-all duration-300 group"
            >
              <Quote className="w-8 h-8 text-rose/20 absolute top-4 right-4 group-hover:text-rose/40 transition-colors" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-sans text-xs text-burgundy/75 leading-relaxed flex-1 mb-4">
                "{t.text}"
              </p>
              <div className="border-t border-rose-pale/50 pt-3">
                <p className="font-serif text-sm font-bold text-burgundy">{t.name}</p>
                {t.service && (
                  <p className="font-sans text-[10px] text-rose uppercase tracking-wider mt-0.5">
                    {t.service}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
