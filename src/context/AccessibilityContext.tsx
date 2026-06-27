import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface AccessibilitySettings {
  largerText: boolean;
  highContrast: boolean;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  toggleLargerText: () => void;
  toggleHighContrast: () => void;
  resetAccessibility: () => void;
}

const STORAGE_KEY = 'lumiere-a11y';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  largerText: false,
  highContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return {
      largerText: Boolean(parsed.largerText),
      highContrast: Boolean(parsed.highContrast),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;
  root.classList.toggle('a11y-large-text', settings.largerText);
  root.classList.toggle('a11y-high-contrast', settings.highContrast);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => loadSettings());

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleLargerText = useCallback(() => {
    setSettings((prev) => ({ ...prev, largerText: !prev.largerText }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const resetAccessibility = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ settings, toggleLargerText, toggleHighContrast, resetAccessibility }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
