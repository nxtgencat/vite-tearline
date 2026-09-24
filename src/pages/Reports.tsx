import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { useHotel } from '@/context/HotelContext';
import { useReports } from '@/hooks/useReports';
import { currency } from '@/lib/format';
import { monthLabels, monthlyRevenue } from '@/lib/seed';

export default function Reports() {
  const { bookings, rooms, guests } = useHotel();
  const r = useReports(bookings, rooms);
  const maxRevenue = Math.max(...monthlyRevenue);
  const activeGuests = new Set(bookings.filter((b) => b.status === 'checked-in').map((b) => b.guestId)).size;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Revenue, occupancy, booking trends and room insights (dummy charts)." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={currency(r.totalRevenue)} hint="Active bookings" />
        <StatCard label="Monthly bookings" value={String(r.monthlyCount)} hint="Active records" />
        <StatCard label="Occupancy rate" value={`${r.occupancy}%`} hint="Rooms occupied" accent={`${r.occupancy}%`} />
        <StatCard label="Most booked type" value={r.mostBooked} hint="By booking count" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card">
          <p className="mini-tag mb-1">REVENUE CHART (DUMMY)</p>
          <p className="text-xs text-slate mb-4">Monthly revenue sample alongside live booking totals.</p>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-cobalt/80" style={{ height: `${Math.round((v / maxRevenue) * 120)}px` }} />
                <span className="text-[10px] text-slate font-mono">{monthLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="mini-tag mb-1">BOOKING TRENDS (LIVE)</p>
          <p className="text-xs text-slate mb-4">Bookings grouped by creation month from real data.</p>
          {r.trend.length === 0 ? (
            <p className="text-sm text-slate">No trend data yet.</p>
          ) : (
            <div className="space-y-2">
              {r.trend.map(([month, count]) => (
                <div key={month} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs w-16 text-slate">{month}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-ink/5 overflow-hidden">
                    <div className="h-full rounded-full bg-mint" style={{ width: `${Math.round((count / r.maxTrend) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <div className="p-3 rounded-xl border border-line"><p className="text-xs text-slate">Active guests</p><p className="font-display font-semibold text-xl">{activeGuests}</p></div>
            <div className="p-3 rounded-xl border border-line"><p className="text-xs text-slate">Registered guests</p><p className="font-display font-semibold text-xl">{guests.length}</p></div>
          </div>
        </div>
      </div>
      <div className="card mt-4">
        <p className="mini-tag mb-3">BOOKINGS BY ROOM TYPE</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(r.byType).length === 0 ? (
            <p className="text-sm text-slate">No data yet.</p>
          ) : (
            Object.entries(r.byType).map(([type, count]) => (
              <span key={type} className="px-3 py-1.5 rounded-full bg-ink/5 text-xs font-medium">{type}: {count}</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
