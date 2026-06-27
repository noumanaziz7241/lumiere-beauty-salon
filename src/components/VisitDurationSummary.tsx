import React from 'react';
import { Clock } from 'lucide-react';
import { Service } from '../types';
import { sumServiceDurationMinutes, formatVisitDuration } from '../../shared/visitDuration.ts';

interface VisitDurationSummaryProps {
  services: Service[];
  className?: string;
  variant?: 'default' | 'compact';
}

export default function VisitDurationSummary({
  services,
  className = '',
  variant = 'default',
}: VisitDurationSummaryProps) {
  if (services.length < 2) return null;

  const totalMinutes = sumServiceDurationMinutes(services);
  const formatted = formatVisitDuration(totalMinutes);
  if (!formatted) return null;

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold text-burgundy/80 ${className}`}>
        <Clock className="w-3 h-3" />
        ~{formatted}
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl border border-rose-pale/80 bg-rose-pale/30 px-3 py-2.5 flex items-start gap-2 ${className}`}
    >
      <Clock className="w-4 h-4 text-rose shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-burgundy">
          Estimated visit: ~{formatted}
        </p>
        <p className="text-[10px] text-burgundy/70 mt-0.5">
          Based on {services.length} selected services — actual time may vary slightly.
        </p>
      </div>
    </div>
  );
}
