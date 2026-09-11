export function currency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function todayInput(): string {
  return new Date().toISOString().slice(0, 10);
}
