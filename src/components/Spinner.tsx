export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate">
      <span className="w-5 h-5 rounded-full border-2 border-line border-t-cobalt animate-spin" />
      {label ?? 'Loading...'}
    </div>
  );
}
