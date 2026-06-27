import React, { useState } from 'react';
import { ChevronDown, Tag } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function PromotionBanner() {
  const { config } = useSalonConfig();
  const { promotion } = config;

  if (!promotion.enabled || !promotion.message.trim()) return null;

  const content = (
    <>
      <Tag className="w-3.5 h-3.5 shrink-0" />
      <span className="font-semibold">{promotion.message}</span>
      {promotion.linkLabel && promotion.linkUrl && (
        <span className="underline underline-offset-2 font-bold">{promotion.linkLabel} →</span>
      )}
    </>
  );

  if (promotion.linkUrl) {
    const isHash = promotion.linkUrl.startsWith('#');
    return (
      <a
        href={promotion.linkUrl}
        onClick={
          isHash
            ? (e) => {
                e.preventDefault();
                document.getElementById(promotion.linkUrl!.slice(1))?.scrollIntoView({ behavior: 'smooth' });
              }
            : undefined
        }
        className="w-full bg-gradient-to-r from-rose to-burgundy text-white text-xs sm:text-sm text-center py-2 px-4 flex items-center justify-center gap-2 hover:from-rose-light hover:to-burgundy-light transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-rose to-burgundy text-white text-xs sm:text-sm text-center py-2 px-4 flex items-center justify-center gap-2">
      {content}
    </div>
  );
}
