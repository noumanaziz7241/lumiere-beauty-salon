import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import heroBg from '../assets/images/salon_hero_bg_1780153729412.png';

interface HeroProps {
  onLearnMoreClick: () => void;
  onBookClick: () => void;
}

export default function Hero({ onLearnMoreClick, onBookClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#fdf8f6]"
    >
      {/* Background image & Mesh gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Luxurious salon interior"
          className="w-full h-full object-cover scale-100"
          referrerPolicy="no-referrer"
        />
        {/* Soft elegant bright overlay to transition to light theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdf8f6] via-[#fdf8f6]/90 to-[#fdf8f6]/75 mix-blend-normal" />
        
        {/* Colorful frosted mesh bubbles */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-pink-200 blur-[130px] opacity-60"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-orange-100 blur-[130px] opacity-60"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fdf8f6] to-transparent" />
      </div>

      {/* Hero content container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        
        {/* Delicate Tag Banner */}
        <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-white/60 border border-white/80 text-pink-700 text-xs uppercase tracking-widest font-bold font-sans mb-6 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Ladies Only Sanctuary</span>
        </div>

        {/* Brand Name Main Title with elegant styling */}
        <div className="space-y-1 mb-5">
          <span className="text-pink-600 font-serif italic text-base sm:text-lg block tracking-wide">Redefining Elegance</span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest text-[#501d2c] drop-shadow-sm select-none uppercase">
            Lumière
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-10 sm:w-16 bg-pink-900/30" />
            <h2 className="font-sans text-xs sm:text-sm font-bold tracking-[0.4em] text-pink-850/80 uppercase">
              Beauty Salon
            </h2>
            <div className="h-[1px] w-10 sm:w-16 bg-pink-900/30" />
          </div>
        </div>

        {/* Taglines from flyer */}
        <p className="font-serif text-lg sm:text-2xl italic text-pink-950 font-medium tracking-wide mb-8">
          "Because You Deserve to Shine" 💖
        </p>

        {/* Central Glassmorphic Card Container */}
        <div className="max-w-xl mx-auto bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden group">
          {/* Subtle warm hover lighting */}
          <div className="absolute -inset-10 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-3xl blur-xl group-hover:scale-105 transition-all duration-500" />
          
          <div className="relative space-y-4">
            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold uppercase text-pink-900 tracking-wider">
              LADIES ONLY
            </h3>
            <p className="font-sans text-xs sm:text-sm uppercase tracking-widest font-semibold text-pink-700 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 animate-pulse" />
              Your Beauty, Our Passion
              <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 animate-pulse" />
            </p>
            <p className="pt-3 text-pink-900/80 text-xs sm:text-sm font-semibold border-t border-white/50">
              Premium treatments in a private, ladies-only setting
            </p>
          </div>
        </div>

        {/* Buttons Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-sans uppercase font-extrabold tracking-widest text-xs bg-pink-900 hover:bg-pink-850 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            Book Appointment
          </button>
          <button
            onClick={onLearnMoreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-sans uppercase font-extrabold tracking-widest text-xs bg-white/50 hover:bg-white/80 text-pink-900 border border-white/75 hover:border-pink-200 focus:outline-none transition-all duration-300 backdrop-blur cursor-pointer"
          >
            Explore Services
          </button>
        </div>

        {/* Minimal scroll prompt */}
        <div className="hidden sm:flex flex-col items-center justify-center mt-12 text-[10px] text-pink-800/50 font-sans tracking-[0.2em] uppercase animate-pulse">
          <span>Scroll To Discover</span>
          <div className="w-1.5 h-1.5 rounded-full bg-pink-500/60 mt-2" />
        </div>
      </div>
    </section>
  );
}
