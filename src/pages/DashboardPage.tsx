import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useCars } from "@/contexts/CarContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { currency, shortDate } from "@/lib/format";

export default function DashboardPage() {
  const s = useDashboardStats();
  const { cars } = useCars();
  const { customers } = useCustomers();

  const stats = [
    { label: "Total Cars", value: s.totalCars, sub: `${s.available} available` },
    { label: "Available Cars", value: s.available, sub: "Ready to rent" },
    { label: "Booked Cars", value: s.booked, sub: "Currently rented" },
    { label: "Customers", value: s.customers, sub: "Registered" },
    { label: "Active Rentals", value: s.activeRentals, sub: "Ongoing trips" },
    { label: "Revenue", value: currency(s.revenue), sub: "Dummy data total" },
  ];

  const carName = (id: string) => {
    const c = cars.find((x) => x.id === id);
    return c ? `${c.brand} ${c.model}` : id;
  };
  const custName = (id: string) => customers.find((x) => x.id === id)?.name || "Customer";

  return (
    <div className="space-y-6">
      <div>
        <span className="ticket-tag">OVERVIEW</span>
        <h1 className="font-display font-semibold text-3xl mt-3">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((x) => (
          <Card key={x.label}>
            <p className="mini-tag mb-2">{x.label.toUpperCase()}</p>
            <p className="font-display font-semibold text-2xl sm:text-3xl">{x.value}</p>
            <p className="text-xs text-slate mt-1">{x.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <h2 className="font-display font-semibold text-lg mb-4">Recent Bookings</h2>
          {s.recent.length === 0 ? (
            <EmptyState title="No bookings yet" hint="Create your first booking to see it here." />
          ) : (
            <div className="divide-y divide-line">
              {s.recent.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{carName(b.carId)}</p>
                    <p className="text-xs text-slate">
                      {custName(b.customerId)} · {shortDate(b.pickupDate)} → {shortDate(b.returnDate)}
                    </p>
                  </div>
                  <span className="font-mono text-xs">{currency(b.totalCost)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid gap-3">
            <Link to="/bookings/new" className="btn-primary text-center">
              New Booking
            </Link>
            <Link to="/cars" className="btn-secondary text-center">
              Manage Cars
            </Link>
            <Link to="/customers" className="btn-outline text-center">
              Add Customer
            </Link>
            <Link to="/reports" className="btn-ghost text-center border border-line">
              View Reports
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
