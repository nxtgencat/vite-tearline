import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookings } from "@/contexts/BookingContext";
import { useCars } from "@/contexts/CarContext";
import { useCustomers } from "@/contexts/CustomerContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import type { Booking } from "@/lib/types";
import { currency, shortDate } from "@/lib/format";

export default function BookingsPage() {
  const { bookings, loading, error, reload, setStatus } = useBookings();
  const { cars, setStatus: setCarStatus } = useCars();
  const { customers } = useCustomers();
  const [q, setQ] = useState("");
  const [status, setStatusFilter] = useState("All");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const carLabel = (id: string) => {
    const c = cars.find((x) => x.id === id);
    return c ? `${c.brand} ${c.model}` : id;
  };
  const custLabel = (id: string) => customers.find((x) => x.id === id)?.name || "Customer";

  const list = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== "All" && b.status !== status) return false;
      if (date && !(b.pickupDate <= date && date <= b.returnDate)) return false;
      const car = cars.find((x) => x.id === b.carId);
      const cust = customers.find((x) => x.id === b.customerId);
      const hay = `${car ? `${car.brand} ${car.model}` : b.carId} ${cust?.name || "Customer"}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [bookings, q, status, date, cars, customers]);

  function cancel(b: Booking) {
    setStatus(b.id, "cancelled");
    setCarStatus(b.carId, "available");
    toast.success("Booking cancelled");
    setSelected(null);
  }

  function complete(b: Booking) {
    setStatus(b.id, "completed");
    setCarStatus(b.carId, "available");
    toast.success("Booking completed");
    setSelected(null);
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <span className="ticket-tag">HISTORY</span>
        <h1 className="font-display font-semibold text-3xl mt-3">Bookings</h1>
        <div className="card p-3 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="ticket-tag">HISTORY · {bookings.length}</span>
          <h1 className="font-display font-semibold text-3xl mt-3">Bookings</h1>
        </div>
        <Link to="/bookings/new" className="btn-primary">
          New booking
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-amber/10 text-sm flex justify-between gap-3">
          <span>{error}</span>
          <button className="text-cobalt font-medium" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      <Card>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="field" placeholder="Search car or customer…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="field" value={status} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </Card>

      {list.length === 0 ? (
        <EmptyState title="No bookings found" hint="Adjust filters or create a new booking." />
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-slate border-b border-line">
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Dates</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((b) => (
                <tr key={b.id}>
                  <td className="p-3 font-medium">{carLabel(b.carId)}</td>
                  <td className="p-3">{custLabel(b.customerId)}</td>
                  <td className="p-3 text-slate text-xs">
                    {shortDate(b.pickupDate)} → {shortDate(b.returnDate)} · {b.days}d
                  </td>
                  <td className="p-3 font-mono text-xs">{currency(b.totalCost)}</td>
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-cobalt text-xs font-medium" onClick={() => setSelected(b)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} title="Booking details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">Car:</span> {carLabel(selected.carId)}</p>
            <p><span className="text-slate">Customer:</span> {custLabel(selected.customerId)}</p>
            <p><span className="text-slate">Pickup:</span> {shortDate(selected.pickupDate)}</p>
            <p><span className="text-slate">Return:</span> {shortDate(selected.returnDate)}</p>
            <p><span className="text-slate">Days:</span> {selected.days}</p>
            <p className="font-semibold">Total: {currency(selected.totalCost)}</p>
            <div className="pt-2">
              <StatusBadge status={selected.status} />
            </div>
            {selected.status === "active" && (
              <div className="flex justify-end gap-3 pt-4">
                <button className="btn-outline" onClick={() => cancel(selected)}>
                  Cancel booking
                </button>
                <button className="btn-primary" onClick={() => complete(selected)}>
                  Mark completed
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
