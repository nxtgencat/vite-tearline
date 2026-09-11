import { Link, useParams } from "react-router-dom";
import { useCars } from "@/contexts/CarContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { currency } from "@/lib/format";

export default function CarDetailPage() {
  const { id } = useParams();
  const { cars } = useCars();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="space-y-4">
        <Link to="/cars" className="text-sm text-cobalt">
          ← Back to cars
        </Link>
        <EmptyState title="Car not found" hint="It may have been deleted." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/cars" className="text-sm text-cobalt">
        ← Back to cars
      </Link>
      <div className="grid md:grid-cols-2 gap-5">
        <img src={car.image} alt={`${car.brand} ${car.model}`} className="rounded-xl w-full h-72 object-cover border border-line" />
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mini-tag mb-2">
                {car.brand.toUpperCase()} · {car.year}
              </p>
              <h1 className="font-display font-semibold text-3xl">{car.model}</h1>
            </div>
            <StatusBadge status={car.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div className="p-3 rounded-lg bg-paper border border-line">
              <p className="mini-tag">PRICE / DAY</p>
              <p className="font-semibold mt-1">{currency(car.pricePerDay)}</p>
            </div>
            <div className="p-3 rounded-lg bg-paper border border-line">
              <p className="mini-tag">FUEL</p>
              <p className="font-semibold mt-1">{car.fuelType}</p>
            </div>
            <div className="p-3 rounded-lg bg-paper border border-line">
              <p className="mini-tag">GEARBOX</p>
              <p className="font-semibold mt-1">{car.transmission}</p>
            </div>
            <div className="p-3 rounded-lg bg-paper border border-line">
              <p className="mini-tag">SEATS</p>
              <p className="font-semibold mt-1">{car.seating}</p>
            </div>
          </div>
          <Link to={`/bookings/new?car=${car.id}`} className="btn-primary w-full text-center mt-6 block">
            Book this car
          </Link>
        </Card>
      </div>
    </div>
  );
}
