import React, { useEffect, useState } from 'react';
import { Copy, Check, MessageCircle, QrCode, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface WhatsAppMessagePanelProps {
  step: number;
  title: string;
  description: string;
  message: string;
  whatsappUrl: string;
  accent?: 'salon' | 'client';
}

export default function WhatsAppMessagePanel({
  step,
  title,
  description,
  message,
  whatsappUrl,
  accent = 'salon',
}: WhatsAppMessagePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(whatsappUrl, {
      width: 220,
      margin: 2,
      color: { dark: '#501d2c', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [whatsappUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const borderClass =
    accent === 'salon' ? 'border-green-300 bg-green-50/50' : 'border-emerald-300 bg-emerald-50/50';

  return (
    <div className={`rounded-2xl border-2 ${borderClass} p-4 sm:p-5 space-y-4`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <div>
          <h4 className="font-serif text-sm font-bold text-burgundy">{title}</h4>
          <p className="text-[11px] text-burgundy/70 font-sans mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <div className="shrink-0 text-center space-y-2">
          <div className="bg-white p-3 rounded-xl border border-green-200 shadow-sm inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code to open WhatsApp: ${title}`}
                width={220}
                height={220}
                className="rounded-md"
              />
            ) : qrError ? (
              <div className="w-[220px] h-[220px] flex items-center justify-center text-xs text-burgundy/50">
                QR unavailable
              </div>
            ) : (
              <div className="w-[220px] h-[220px] flex items-center justify-center">
                <QrCode className="w-10 h-10 text-green-400 animate-pulse" />
              </div>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-green-800">
            Scan with phone camera
          </p>
        </div>

        <div className="flex-1 w-full space-y-3 min-w-0">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-burgundy/60 mb-1.5">
              Pre-filled message
            </p>
            <pre className="text-[11px] text-burgundy/90 font-sans whitespace-pre-wrap break-words bg-white/80 border border-green-100 rounded-xl p-3 max-h-48 overflow-y-auto leading-relaxed">
              {message}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-wider border border-green-200 bg-white hover:bg-green-50 text-burgundy transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy message'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold tracking-wider bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Open WhatsApp
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-amber-900/80 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-sans">
        After WhatsApp opens, tap the green <strong>Send</strong> button to deliver this message.
      </p>
    </div>
  );
}
