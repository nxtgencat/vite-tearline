export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-slate mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
