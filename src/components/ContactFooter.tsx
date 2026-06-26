import React from 'react';
import { Clock, ShieldCheck, Heart, Sparkles, ChevronUp } from 'lucide-react';

interface ContactFooterProps {
  onBackToTop: () => void;
}

export default function ContactFooter({ onBackToTop }: ContactFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="hours" className="bg-[#501d2c] border-t border-[#3d1320] text-pink-100 relative">
      
      {/* Scroll back to top element */}
      <button
        onClick={onBackToTop}
        className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white hover:bg-pink-50 border border-pink-100/50 text-pink-900 flex items-center justify-center transition-all cursor-pointer shadow-md"
        title="Scroll back to top"
      >
        <ChevronUp className="w-5 h-5 animate-bounce" />
      </button>

      {/* Top Footer Banner */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#3d1320]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Column 1: Editorial Branding */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-pink-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg font-black tracking-widest text-[#fdf8f6]">
                LUMIÈRE BEAUTY SALON
              </span>
            </div>
            <p className="font-sans text-xs text-pink-200/80 leading-relaxed max-w-xs font-semibold">
              A private, premium, and fully hygienic **Ladies Only** beauty sanctuary. We design custom cuts, HD makeup, and restorative facials tailored to make your natural radiance shine.
            </p>
            <div className="pt-2 text-[11px] font-sans text-white font-bold uppercase tracking-widest flex items-center gap-1.5 bg-pink-955/35 border border-pink-500/10 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-pink-300" />
              <span>Strictly Ladies Only Venue</span>
            </div>
          </div>

          {/* Column 2: Hours & Schedule */}
          <div className="space-y-4">
            <h4 className="font-serif text-xs font-bold text-pink-200 uppercase tracking-widest">Business hours</h4>
            <div className="w-10 h-0.5 bg-pink-400/40" />
            
            <div className="space-y-3 font-sans text-xs text-pink-200/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex justify-between w-64">
                    <span className="font-semibold text-[#fdf8f6]">Tuesday – Sunday:</span>
                    <span>10:30 AM – 08:30 PM</span>
                  </div>
                  <div className="flex justify-between w-64 text-pink-300/70">
                    <span>Mondays:</span>
                    <span className="uppercase text-[10px] font-bold text-pink-300">Closed for Sanitization</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-pink-300/50 leading-relaxed italic pl-6.5 max-w-xs">
                *Booking in advance guarantees that our stylist has a fully dedicated time block designated for your service.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Slogan & Copyright Bottom section */}
      <div className="bg-[#3d1320] py-10 text-center space-y-4 px-4 border-t border-[#2e0915]">
        <p className="font-serif text-lg italic text-[#fdf8f6] flex items-center justify-center gap-1.5">
          "Look Beautiful, Feel Beautiful."
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-pink-200 font-extrabold flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 animate-pulse" />
          BE BEAUTIFUL, BE YOU!
          <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 animate-pulse" />
        </p>

        <div className="text-[10px] text-pink-300/40 font-semibold font-sans pt-4 max-w-sm mx-auto border-t border-pink-500/10 space-y-1">
          <p>© {currentYear} Lumière Beauty Salon. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}
