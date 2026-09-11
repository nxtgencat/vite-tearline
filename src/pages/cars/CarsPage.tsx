import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCars } from "@/contexts/CarContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeletonGrid } from "@/components/ui/Skeleton";
import CarForm, { toFormValue } from "@/components/cars/CarForm";
import type { Car } from "@/lib/types";
import { currency } from "@/lib/format";

export default function CarsPage() {
  const { cars, loading, error, reload, addCar, updateCar, removeCar } = useCars();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [gear, setGear] = useState("All");
  const [sort, setSort] = useState("none");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState<Car | null>(null);

  const brands = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.brand)))], [cars]);

  const list = useMemo(() => {
    let out = cars.filter((c) => {
      const hit = `${c.brand} ${c.model}`.toLowerCase().includes(q.toLowerCase());
      if (!hit) return false;
      if (brand !== "All" && c.brand !== brand) return false;
      if (fuel !== "All" && c.fuelType !== fuel) return false;
      if (gear !== "All" && c.transmission !== gear) return false;
      return true;
    });
    if (sort === "low") out = [...out].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "high") out = [...out].sort((a, b) => b.pricePerDay - a.pricePerDay);
    return out;
  }, [cars, q, brand, fuel, gear, sort]);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="font-display font-semibold text-3xl">Cars</h1>
        <CardSkeletonGrid />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="ticket-tag">FLEET · {cars.length}</span>
          <h1 className="font-display font-semibold text-3xl mt-3">Cars</h1>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          Add car
        </button>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className="field" placeholder="Search brand or model…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="field" value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select className="field" value={fuel} onChange={(e) => setFuel(e.target.value)}>
            <option>All</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
          <select className="field" value={gear} onChange={(e) => setGear(e.target.value)}>
            <option>All</option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
          <select className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="none">Sort: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </Card>

      {list.length === 0 ? (
        <EmptyState title="No cars found" hint="Try clearing filters or add a new car." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => (
            <Card key={c.id} className="p-0 overflow-hidden">
              <Link to={`/cars/${c.id}`}>
                <img src={c.image} alt={`${c.brand} ${c.model}`} className="h-44 w-full object-cover" loading="lazy" />
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold">
                      {c.brand} {c.model}
                    </p>
                    <p className="text-xs text-slate">
                      {c.year} · {c.fuelType} · {c.transmission} · {c.seating} seats
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-mono text-sm font-semibold">
                    {currency(c.pricePerDay)}
                    <span className="text-slate font-normal">/day</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="btn-outline px-3 py-1.5 text-xs"
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="px-3 py-1.5 rounded-full bg-rose/10 text-rose text-xs font-medium" onClick={() => setDeleting(c)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showForm} title={editing ? "Edit car" : "Add car"} onClose={() => setShowForm(false)}>
        <CarForm
          key={editing?.id || "new"}
          initial={toFormValue(editing || undefined)}
          onCancel={() => setShowForm(false)}
          onSubmit={(v) => {
            if (editing) {
              updateCar(editing.id, v);
              toast.success("Car updated");
            } else {
              addCar({ ...v, status: "available" });
              toast.success("Car added");
            }
            setShowForm(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete car?"
        message={`Remove ${deleting?.brand} ${deleting?.model} from the fleet? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            removeCar(deleting.id);
            toast.success("Car deleted");
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}
