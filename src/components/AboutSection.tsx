import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function AboutSection() {
  const { config } = useSalonConfig();
  const { about } = config;

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-cream via-gold-pale/30 to-cream-warm border-t border-rose-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
                About Lumière
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">
                {about.title}
              </h2>
              <p className="font-serif text-lg italic text-burgundy-light mt-2">
                {about.subtitle}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto lg:mx-0 mt-4 rounded-full" />
            </div>

            <div className="space-y-4">
              {about.paragraphs.map((para, i) => (
                <p key={i} className="font-sans text-sm text-burgundy/80 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {about.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="card-shimmer backdrop-blur-xl border border-white/80 p-5 rounded-2xl flex items-start gap-3 hover:shadow-lg hover:border-rose-pale transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5 text-rose shrink-0 mt-0.5" />
                  <span className="font-sans text-xs font-bold text-burgundy leading-snug">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy to-burgundy-light p-8 text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-2xl" />
              <Sparkles className="w-8 h-8 text-gold-light mx-auto mb-3" />
              <p className="font-serif text-xl italic text-cream">
                "Every woman deserves to feel like royalty."
              </p>
              <p className="font-sans text-xs text-rose-pale/80 mt-2 uppercase tracking-widest">
                — The Lumière Promise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
