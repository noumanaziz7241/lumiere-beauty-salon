import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onSectionClick: (sectionId: string) => void;
}

export default function Navbar({ onBookClick, onSectionClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Services', id: 'services' },
    { label: 'Why Choose Us', id: 'why-us' },
    { label: 'Hours', id: 'hours' },
  ];

  return (
    <nav
      id="salon-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 shadow-md border-b border-pink-100/40 py-2 backdrop-blur-md'
          : 'bg-white/30 py-4 border-b border-white/20'
      }`}
    >
      {/* Top Banner for Ladies Only distinction */}
      <div className="w-full bg-pink-900 text-pink-50 text-xs text-center py-1 px-4 flex items-center justify-center gap-1.5 font-sans tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-pink-200" />
        <span className="font-semibold text-pink-100">LADIES ONLY SALON</span> • Professional Care Guaranteed
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex items-center justify-between h-14">
          {/* Logo Brand */}
          <div
            onClick={() => onSectionClick('hero')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-pink-700 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-black tracking-wider text-pink-900 group-hover:text-pink-700 transition-colors">
                  Lumière
                </span>
                <span className="text-[10px] font-sans font-bold tracking-widest text-pink-700 uppercase px-1.5 py-0.5 rounded bg-pink-50 border border-pink-100">
                  Ladies Only
                </span>
              </div>
              <p className="text-[9px] font-sans font-semibold tracking-widest text-pink-805/70 uppercase -mt-0.5">
                Beauty Salon
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionClick(item.id)}
                  className="font-sans text-pink-900/80 hover:text-pink-600 text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer p-1"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={onBookClick}
              className="px-6 py-2.5 rounded-xl font-sans text-xs uppercase font-bold tracking-widest bg-pink-900 text-white shadow-sm hover:bg-pink-800 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Book Stylist
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onBookClick}
              className="px-5 py-2 rounded-xl font-sans text-[10px] uppercase font-bold tracking-wider bg-pink-900 text-white shadow-sm"
            >
              Book
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 px-2 rounded-lg bg-white/70 border border-pink-150 text-pink-900 hover:text-pink-650 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-pink-100 backdrop-blur-lg animate-fadeIn duration-200 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionClick(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left font-sans text-pink-900 hover:text-pink-600 text-base font-semibold py-2 px-4 rounded-xl hover:bg-pink-50 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-pink-100/50 px-4">
              <button
                onClick={() => {
                  onBookClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3.5 rounded-xl font-sans text-xs uppercase font-extrabold tracking-widest text-center bg-pink-900 text-white shadow hover:bg-pink-800 cursor-pointer block"
              >
                Book Appointment Today
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
