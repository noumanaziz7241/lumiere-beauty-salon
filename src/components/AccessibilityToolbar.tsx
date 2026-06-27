import React, { useState } from 'react';
import { Accessibility, Type, Contrast, X } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityToolbar() {
  const { settings, toggleLargerText, toggleHighContrast, resetAccessibility } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-4 sm:left-6 z-40 flex flex-col items-start gap-2">
      {open && (
        <div
          className="bg-white border border-rose-pale rounded-2xl shadow-xl p-4 w-56 animate-fadeIn"
          role="region"
          aria-label="Accessibility options"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-burgundy">Accessibility</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-burgundy/50 hover:text-burgundy cursor-pointer"
              aria-label="Close accessibility menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={toggleLargerText}
              aria-pressed={settings.largerText}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                settings.largerText
                  ? 'bg-burgundy text-white'
                  : 'bg-cream-warm text-burgundy hover:bg-rose-pale'
              }`}
            >
              <Type className="w-4 h-4" />
              Larger text
            </button>
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-pressed={settings.highContrast}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                settings.highContrast
                  ? 'bg-burgundy text-white'
                  : 'bg-cream-warm text-burgundy hover:bg-rose-pale'
              }`}
            >
              <Contrast className="w-4 h-4" />
              High contrast
            </button>
            {(settings.largerText || settings.highContrast) && (
              <button
                type="button"
                onClick={resetAccessibility}
                className="w-full text-xs text-burgundy/70 hover:text-burgundy py-1 cursor-pointer"
              >
                Reset defaults
              </button>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Accessibility settings"
        title="Accessibility"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-rose-pale text-burgundy shadow-lg hover:shadow-xl hover:bg-rose-pale/40 transition-all cursor-pointer"
      >
        <Accessibility className="w-5 h-5" />
      </button>
    </div>
  );
}
