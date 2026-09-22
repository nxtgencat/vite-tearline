// Pure formatting and date helpers, no JSX here.
export function currency(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}

export function shortDate(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function stayDuration(checkIn: string, checkOut: string): string {
  const n = nightsBetween(checkIn, checkOut);
  if (n <= 0) return '0 nights';
  return n === 1 ? '1 night' : `${n} nights`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const a1 = new Date(aStart).getTime();
  const a2 = new Date(aEnd).getTime();
  const b1 = new Date(bStart).getTime();
  const b2 = new Date(bEnd).getTime();
  return Math.max(a1, b1) < Math.min(a2, b2);
}
