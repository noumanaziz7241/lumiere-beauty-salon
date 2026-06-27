import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SalonConfig, DEFAULT_SALON_CONFIG, STORAGE_KEY, ADMIN_SESSION_KEY } from '../config/defaults';

interface SalonConfigContextValue {
  config: SalonConfig;
  updateConfig: (partial: Partial<SalonConfig>) => void;
  resetConfig: () => void;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const SalonConfigContext = createContext<SalonConfigContextValue | null>(null);

function loadConfig(): SalonConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SALON_CONFIG, ...parsed };
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_SALON_CONFIG;
}

export function SalonConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SalonConfig>(loadConfig);
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((partial: Partial<SalonConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_SALON_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(
    (password: string) => {
      if (password === config.adminPassword) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        setIsAdmin(true);
        return true;
      }
      return false;
    },
    [config.adminPassword]
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <SalonConfigContext.Provider
      value={{ config, updateConfig, resetConfig, isAdmin, login, logout }}
    >
      {children}
    </SalonConfigContext.Provider>
  );
}

export function useSalonConfig() {
  const ctx = useContext(SalonConfigContext);
  if (!ctx) throw new Error('useSalonConfig must be used within SalonConfigProvider');
  return ctx;
}
