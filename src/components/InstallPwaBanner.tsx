import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    if (localStorage.getItem('pwa-install-dismissed') === '1') {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone || dismissed || !deferredPrompt) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 bg-burgundy text-white rounded-2xl shadow-2xl p-4 border border-rose/30 animate-slideUp">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-rose-pale/70 hover:text-white cursor-pointer"
        aria-label="Dismiss install prompt"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex gap-3 pr-6">
        <Download className="w-8 h-8 text-rose-light shrink-0" />
        <div>
          <p className="font-serif font-bold text-sm">Add Lumière to Home Screen</p>
          <p className="text-xs text-rose-pale/80 mt-1">
            Install our app for quick booking and offers on your phone.
          </p>
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 px-4 py-2 rounded-lg bg-white text-burgundy text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-rose-pale transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
