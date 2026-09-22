export default function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="p-10 rounded-xl border border-dashed border-line text-center bg-surface">
      <div className="w-10 h-10 rounded-full bg-ink/5 grid place-content-center mx-auto mb-3 text-slate">∅</div>
      <p className="text-sm font-medium">{title}</p>
      {hint ? <p className="text-xs text-slate mt-1 mb-4">{hint}</p> : null}
      {action}
    </div>
  );
}
