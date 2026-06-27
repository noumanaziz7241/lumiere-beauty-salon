import React, { useMemo, useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function FAQSection() {
  const { config } = useSalonConfig();
  const [openId, setOpenId] = useState<string | null>(config.faq[0]?.id ?? null);

  const categories = useMemo(() => {
    const set = new Set(config.faq.map((f) => f.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [config.faq]);

  const [activeCategory, setActiveCategory] = useState('All');

  const items =
    activeCategory === 'All'
      ? config.faq
      : config.faq.filter((f) => (f.category || 'General') === activeCategory);

  if (!config.faq.length) return null;

  return (
    <section id="faq" className="py-20 bg-cream border-t border-rose-pale/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
            Good to know
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">FAQ</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-burgundy text-white border-burgundy'
                  : 'bg-white text-burgundy/70 border-rose-pale hover:border-rose'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-rose-pale/60 bg-white/70 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="w-full flex items-start gap-3 p-4 text-left cursor-pointer hover:bg-rose-pale/20 transition-colors"
                >
                  <HelpCircle className="w-5 h-5 text-rose shrink-0 mt-0.5" />
                  <span className="flex-1 font-serif font-bold text-burgundy text-sm">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-burgundy/50 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 pl-12 text-sm text-burgundy/75 font-sans leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
