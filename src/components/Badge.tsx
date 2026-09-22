const tones: Record<string, string> = {
  confirmed: 'bg-cobalt/10 text-cobalt-dark',
  'checked-in': 'bg-mint/10 text-mint',
  'checked-out': 'bg-ink/5 text-slate',
  cancelled: 'bg-rose/10 text-rose',
  completed: 'bg-mint/10 text-mint',
  paid: 'bg-mint/10 text-mint',
  pending: 'bg-amber/15 text-amber',
  refunded: 'bg-rose/10 text-rose',
  available: 'bg-mint/10 text-mint',
  occupied: 'bg-rose/10 text-rose',
};

export default function Badge({ value }: { value: string }) {
  const tone = tones[value] ?? 'bg-ink/5 text-slate';
  return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${tone}`}>{value}</span>;
}
