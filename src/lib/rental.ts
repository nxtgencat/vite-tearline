export function calcDays(pickup: string, ret: string): number {
  const a = new Date(pickup).getTime();
  const b = new Date(ret).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0;
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}

export function calcTotal(days: number, pricePerDay: number): number {
  return days * pricePerDay;
}

export function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
