/** Parse human-readable durations like "45 mins", "2 hrs", "180 mins". */
export function parseDurationMinutes(text: string): number {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return 0;

  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h(?:our|rs?)?/);
  const minMatch = normalized.match(/(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?/);

  let total = 0;
  if (hourMatch) total += Math.round(parseFloat(hourMatch[1]) * 60);
  if (minMatch) total += Math.round(parseFloat(minMatch[1]));

  if (!hourMatch && !minMatch) {
    const digits = normalized.match(/(\d+)/);
    if (digits) total += parseInt(digits[1], 10);
  }

  return total;
}

export function sumServiceDurationMinutes(
  services: { estimatedDuration: string }[],
): number {
  return services.reduce((sum, s) => sum + parseDurationMinutes(s.estimatedDuration), 0);
}

export function formatVisitDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
