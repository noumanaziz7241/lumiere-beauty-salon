import React, { useMemo } from 'react';
import { Sparkles, CalendarHeart } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import type { BridalPackage } from '../config/marketingDefaults';
import type { Service } from '../types';

interface PackagesSectionProps {
  onBookPackage: (services: Service[]) => void;
}

export default function PackagesSection({ onBookPackage }: PackagesSectionProps) {
  const { config } = useSalonConfig();

  const serviceMap = useMemo(() => {
    const map = new Map<string, Service>();
    config.services.forEach((cat) => cat.services.forEach((s) => map.set(s.id, s)));
    return map;
  }, [config.services]);

  const resolvePackage = (pkg: BridalPackage) =>
    pkg.serviceIds.map((id) => serviceMap.get(id)).filter((s): s is Service => Boolean(s));

  const formatPKR = (amount: number) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(
      amount,
    );

  if (!config.packages.length) return null;

  return (
    <section id="packages" className="py-20 bg-cream-warm border-y border-rose-pale/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
            Curated for you
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-burgundy">
            Bridal & Party Packages
          </h2>
          <p className="text-sm text-burgundy/60 mt-3 font-sans">
            Pre-selected service bundles — one click to book
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.packages.map((pkg) => {
            const services = resolvePackage(pkg);
            const total = services.reduce((sum, s) => sum + s.pricePKR, 0);

            return (
              <article
                key={pkg.id}
                className="rounded-3xl border border-rose-pale/60 bg-white/80 backdrop-blur p-6 flex flex-col shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      pkg.badge === 'Bridal'
                        ? 'bg-burgundy text-white'
                        : pkg.badge === 'Party'
                          ? 'bg-rose text-white'
                          : 'bg-gold/20 text-burgundy border border-gold/40'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                  {pkg.highlight && (
                    <span className="text-[10px] text-rose font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {pkg.highlight}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-black text-burgundy mb-2">{pkg.name}</h3>
                <p className="text-sm text-burgundy/70 font-sans leading-relaxed mb-4 flex-1">
                  {pkg.description}
                </p>

                <ul className="space-y-1.5 mb-4 text-xs text-burgundy/80">
                  {services.map((s) => (
                    <li key={s.id} className="flex justify-between gap-2">
                      <span>{s.name}</span>
                      <span className="font-semibold shrink-0">{formatPKR(s.pricePKR)}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-rose-pale/50 pt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-burgundy/50 font-bold">Package total</p>
                    <p className="font-sans text-lg font-extrabold text-burgundy">{formatPKR(total)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={services.length === 0}
                    onClick={() => onBookPackage(services)}
                    className="px-4 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-light text-white text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <CalendarHeart className="w-4 h-4" />
                    Book package
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
