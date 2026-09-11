export default function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium mb-1.5 block">{label}</span>
      {children}
      {error && <span className="text-xs text-rose mt-1.5 block">{error}</span>}
    </label>
  );
}
