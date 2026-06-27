import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import { buildInquiryMessage, buildWhatsAppUrl } from '../lib/whatsapp';
import TawkToLoader, { openTawkChat } from './TawkToLoader';

export default function ChatWidget() {
  const { config } = useSalonConfig();
  const chat = config.chat;

  if (!chat.enabled) return null;

  const useTawk =
    chat.provider === 'tawk' && chat.tawkPropertyId.trim() && chat.tawkWidgetId.trim();

  const whatsappHref = buildWhatsAppUrl(
    config.contact.whatsapp,
    buildInquiryMessage(),
  );

  if (useTawk) {
    return (
      <>
        <TawkToLoader
          propertyId={chat.tawkPropertyId.trim()}
          widgetId={chat.tawkWidgetId.trim()}
        />
        <button
          type="button"
          onClick={() => openTawkChat()}
          aria-label="Open live chat"
          title="Live chat"
          className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-burgundy hover:bg-burgundy-light text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Live Chat
          </span>
        </button>
      </>
    );
  }

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp to book an appointment"
      title="Book on WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">
        {chat.whatsappLabel || 'Book on WhatsApp'}
      </span>
    </a>
  );
}
