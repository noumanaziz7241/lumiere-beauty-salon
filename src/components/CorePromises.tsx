import React from 'react';
import { Award, ShieldAlert, Crown, Flame, Syringe, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function CorePromises() {
  const promises = [
    {
      title: 'Professional Staff',
      description: 'Highly trained hair stylists and certified skin beauticians with years of premium treatment mastery.',
      icon: Award,
    },
    {
      title: 'Premium Quality',
      description: 'Only imported, non-toxic, and dermatologist-approved beauty cosmetics are placed on your skin and hair.',
      icon: GoldCrownIcon,
    },
    {
      title: 'Hygienic & Safe',
      description: '100% sanitized tools, disposal towels, and ultra-hygienic individual waxing sheets for complete safety.',
      icon: ShieldCheck,
    },
    {
      title: 'Exclusive Care',
      description: 'Custom consultations. Because your skin and style are unique, we tailor our touch to optimize your beauty.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-gradient-to-b from-[#fdf8f6] via-white to-[#fdf8f6] border-t border-b border-pink-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-pink-600 mb-2">Our Core Standards</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-pink-900">
            Commitments to Our Guests
          </h2>
          <div className="w-16 h-1 bg-pink-200 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((promise, index) => {
            const IconComponent = promise.icon;
            return (
              <div
                key={index}
                className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-white/80 hover:border-pink-200 hover:shadow-lg transition-all duration-300"
              >
                {/* top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-pink-500 group-hover:h-1.5 transition-all" />

                <div className="w-14 h-14 rounded-full bg-pink-50 border border-white flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-pink-200 transition-transform shadow-sm">
                  <IconComponent className="w-7 h-7 text-pink-600 group-hover:text-pink-800" />
                </div>

                <h3 className="font-serif text-base font-extrabold text-pink-900 mb-2.5 tracking-wide uppercase">
                  {promise.title}
                </h3>
                <p className="font-sans text-xs text-pink-955/70 leading-relaxed font-medium">
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

// Custom crown icon render
function GoldCrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}
