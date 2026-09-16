import Card from "@/components/ui/Card";
import { useReports } from "@/hooks/useReports";
import { currency } from "@/lib/format";

export default function ReportsPage() {
  const r = useReports();

  return (
    <div className="space-y-5">
      <div>
        <span className="ticket-tag">INSIGHTS</span>
        <h1 className="font-display font-semibold text-3xl mt-3">Reports</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="mini-tag mb-2">TOTAL REVENUE</p>
          <p className="font-display font-semibold text-2xl">{currency(r.totalRevenue)}</p>
        </Card>
        <Card>
          <p className="mini-tag mb-2">TOTAL BOOKINGS</p>
          <p className="font-display font-semibold text-2xl">{r.totalBookings}</p>
        </Card>
        <Card>
          <p className="mini-tag mb-2">MOST RENTED</p>
          <p className="font-display font-semibold text-lg leading-snug">
            {r.mostRented ? `${r.mostRented.brand} ${r.mostRented.model}` : "—"}
          </p>
          <p className="text-xs text-slate mt-1">{r.mostRentedCount} rentals</p>
        </Card>
        <Card>
          <p className="mini-tag mb-2">ACTIVE CUSTOMERS</p>
          <p className="font-display font-semibold text-2xl">{r.activeCustomers}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-display font-semibold text-lg mb-1">Monthly Booking Summary</h2>
        <p className="text-xs text-slate mb-5">Revenue · last 6 months (dummy + live bookings)</p>
        <div className="flex items-end gap-3 h-44">
          {r.monthly.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-lg bg-cobalt/85 min-h-[8px]"
                style={{ height: `${Math.max(6, (m.revenue / r.maxRevenue) * 140)}px` }}
                title={`${m.month}: ${currency(m.revenue)}`}
              />
              <span className="font-mono text-[10px] text-slate">{m.month}</span>
              <span className="font-mono text-[10px]">{m.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-semibold text-lg mb-3">Revenue Chart</h2>
        <div className="space-y-3">
          {r.monthly.map((m) => (
            <div key={m.month} className="flex items-center gap-3 text-sm">
              <span className="w-10 font-mono text-xs text-slate">{m.month}</span>
              <div className="flex-1 h-3 rounded-full bg-ink/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cobalt to-amber"
                  style={{ width: `${Math.max(4, (m.revenue / r.maxRevenue) * 100)}%` }}
                />
              </div>
              <span className="w-20 text-right font-mono text-xs">{currency(m.revenue)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
