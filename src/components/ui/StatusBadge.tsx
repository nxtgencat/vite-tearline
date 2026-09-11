import type { BookingStatus, CarStatus } from "@/lib/types";

const styles: Record<CarStatus | BookingStatus, string> = {
  available: "bg-mint/15 text-mint",
  rented: "bg-cobalt/10 text-cobalt",
  maintenance: "bg-amber/15 text-amber",
  active: "bg-cobalt/10 text-cobalt",
  completed: "bg-mint/15 text-mint",
  cancelled: "bg-rose/10 text-rose",
};

export default function StatusBadge({ status }: { status: CarStatus | BookingStatus }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
