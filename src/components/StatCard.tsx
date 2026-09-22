export default function StatCard({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="card">
      <p className="mini-tag">{label}</p>
      <p className="font-display font-semibold text-3xl mt-2 tracking-tight">{value}</p>
      {hint ? <p className="text-xs text-slate mt-1">{hint}</p> : null}
      {accent ? <div className="mt-3 h-1.5 rounded-full bg-ink/5 overflow-hidden"><div className="h-full rounded-full bg-cobalt" style={{ width: accent }} /></div> : null}
    </div>
  );
}
