import React from 'react';
import { Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function CorePromises() {
  const { config } = useSalonConfig();
  const icons = [Award, GoldCrownIcon, ShieldCheck, HeartHandshake];

  return (
    <section id="why-us" className="py-20 bg-gradient-to-b from-cream via-white to-cream-warm border-t border-b border-rose-pale/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">Our Core Standards</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">
            Commitments to Our Guests
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.corePromises.map((promise, index) => {
            const IconComponent = icons[index] || Award;
            return (
              <div
                key={index}
                className="relative card-shimmer backdrop-blur-xl border border-white/70 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center group hover:shadow-xl hover:border-rose-light/40 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-light to-rose group-hover:h-1.5 transition-all rounded-t-2xl" />
                <div className="w-14 h-14 rounded-full bg-rose-pale border border-white flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-rose-light transition-transform shadow-sm">
                  <IconComponent className="w-7 h-7 text-rose group-hover:text-burgundy" />
                </div>
                <h3 className="font-serif text-base font-extrabold text-burgundy mb-2.5 tracking-wide uppercase">
                  {promise.title}
                </h3>
                <p className="font-sans text-xs text-burgundy/70 leading-relaxed font-medium">
                  {promise.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GoldCrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}
