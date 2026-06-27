import React, { useEffect } from 'react';
import { useSalonConfig } from '../context/SalonConfigContext';

declare global {
  interface Window {
    Tawk_API?: { maximize?: () => void; toggle?: () => void };
    Tawk_LoadStart?: Date;
  }
}

interface TawkToLoaderProps {
  propertyId: string;
  widgetId: string;
}

export default function TawkToLoader({ propertyId, widgetId }: TawkToLoaderProps) {
  useEffect(() => {
    if (!propertyId || !widgetId) return;

    const scriptId = 'tawk-script';
    if (document.getElementById(scriptId)) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      script.remove();
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [propertyId, widgetId]);

  return null;
}

export function openTawkChat() {
  window.Tawk_API?.maximize?.();
}
