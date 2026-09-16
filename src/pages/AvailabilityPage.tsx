import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCars } from "@/contexts/CarContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import type { CarStatus } from "@/lib/types";

const tabs: Array<"All" | CarStatus> = ["All", "available", "rented", "maintenance"];

export default function AvailabilityPage() {
  const { cars, setStatus } = useCars();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const counts = useMemo(() => {
    return {
      available: cars.filter((c) => c.status === "available").length,
      rented: cars.filter((c) => c.status === "rented").length,
      maintenance: cars.filter((c) => c.status === "maintenance").length,
    };
  }, [cars]);

  const list = tab === "All" ? cars : cars.filter((c) => c.status === tab);

  function change(id: string, s: CarStatus) {
    setStatus(id, s);
    toast.success(`Car marked ${s}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="ticket-tag">FLEET STATUS</span>
        <h1 className="font-display font-semibold text-3xl mt-3">Availability</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="mini-tag mb-1">AVAILABLE</p>
          <p className="font-display font-semibold text-3xl text-mint">{counts.available}</p>
        </Card>
        <Card>
          <p className="mini-tag mb-1">RENTED</p>
          <p className="font-display font-semibold text-3xl text-cobalt">{counts.rented}</p>
        </Card>
        <Card>
          <p className="mini-tag mb-1">MAINTENANCE</p>
          <p className="font-display font-semibold text-3xl text-amber">{counts.maintenance}</p>
        </Card>
      </div>

      <div className="inline-flex p-1 rounded-full bg-ink/5 text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full capitalize ${tab === t ? "bg-surface shadow-sm font-medium" : "text-slate"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No cars in this state" hint="Switch tabs or update a car status." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => (
            <Card key={c.id}>
              <div className="flex items-center gap-3">
                <img src={c.image} alt="" className="w-16 h-12 object-cover rounded-lg border border-line" />
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {c.brand} {c.model}
                  </p>
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <select
                className="field mt-4"
                value={c.status}
                onChange={(e) => change(c.id, e.target.value as CarStatus)}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
