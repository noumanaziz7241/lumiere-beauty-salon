import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SalonConfig, DEFAULT_SALON_CONFIG, PublicSalonConfig } from '../config/defaults';
import { api } from '../api/client';

interface SalonConfigContextValue {
  config: SalonConfig;
  loading: boolean;
  error: string | null;
  updateConfig: (config: SalonConfig) => Promise<void>;
  resetConfig: () => Promise<void>;
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const SalonConfigContext = createContext<SalonConfigContextValue | null>(null);

function toSalonConfig(publicConfig: PublicSalonConfig): SalonConfig {
  return { ...publicConfig, adminPassword: '' };
}

export function SalonConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SalonConfig>(() => DEFAULT_SALON_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshConfig = useCallback(async () => {
    try {
      const publicConfig = await api.getConfig();
      setConfig(toSalonConfig(publicConfig));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [publicConfig, auth] = await Promise.all([
          api.getConfig(),
          api.checkAuth(),
        ]);
        setConfig(toSalonConfig(publicConfig));
        setIsAdmin(auth.authenticated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const updateConfig = useCallback(async (newConfig: SalonConfig) => {
    const { adminPassword: _, ...publicConfig } = newConfig;
    const saved = await api.updateConfig(publicConfig);
    setConfig(toSalonConfig(saved));
  }, []);

  const resetConfig = useCallback(async () => {
    const saved = await api.resetConfig();
    setConfig(toSalonConfig(saved));
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      await api.login(password);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setIsAdmin(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-rose border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-sm text-burgundy/60">Loading salon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <p className="font-serif text-xl font-bold text-burgundy">Unable to connect</p>
          <p className="font-sans text-sm text-burgundy/60">{error}</p>
          <p className="font-sans text-xs text-burgundy/40">
            Make sure the API server is running: <code className="bg-rose-pale/50 px-1 rounded">npm run server</code>
          </p>
          <button
            onClick={() => { setLoading(true); refreshConfig().finally(() => setLoading(false)); }}
            className="px-6 py-2.5 rounded-xl bg-burgundy text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SalonConfigContext.Provider
      value={{ config, loading, error, updateConfig, resetConfig, isAdmin, login, logout, refreshConfig }}
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
