import { Link } from 'react-router-dom';
import { useHotel } from '@/context/HotelContext';
import { useDashboard } from '@/hooks/useDashboard';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import { currency, shortDate } from '@/lib/format';

export default function Dashboard() {
  const { rooms, guests, bookings } = useHotel();
  const s = useDashboard(rooms, guests, bookings);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Today's hotel overview at a glance."
        action={<Link to="/book" className="btn-primary">+ New booking</Link>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total rooms" value={String(s.totalRooms)} hint={`${s.availableRooms} available`} />
        <StatCard label="Available" value={String(s.availableRooms)} hint={`${s.occupancy}% occupied`} accent={`${s.occupancy}%`} />
        <StatCard label="Occupied" value={String(s.occupiedRooms)} hint="Out of service + stays" />
        <StatCard label="Guests" value={String(s.totalGuests)} hint="Registered profiles" />
        <StatCard label="Check-ins today" value={String(s.checkIns)} hint={new Date().toDateString()} />
        <StatCard label="Check-outs today" value={String(s.checkOuts)} hint={new Date().toDateString()} />
        <StatCard label="Bookings" value={String(s.totalBookings)} hint="Active records" />
        <StatCard label="Revenue" value={currency(s.revenue)} hint="Dummy summary" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card">
          <p className="mini-tag mb-3">RECENT BOOKINGS</p>
          {s.recent.length === 0 ? (
            <EmptyState title="No bookings yet" hint="Create your first booking to see it here." />
          ) : (
            <div className="divide-y divide-line">
              {s.recent.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{b.id} · Room {rooms.find((r) => r.id === b.roomId)?.number}</p>
                    <p className="text-xs text-slate">{shortDate(b.checkIn)} → {shortDate(b.checkOut)} · {currency(b.total)}</p>
                  </div>
                  <Badge value={b.status} />
                </div>
              ))}
            </div>
          )}
          <Link to="/history" className="text-xs text-cobalt mt-3 inline-block">View all bookings →</Link>
        </div>
        <div className="card">
          <p className="mini-tag mb-3">QUICK ACTIONS</p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/rooms" className="p-4 rounded-xl border border-line hover:border-ink transition-colors text-sm font-medium">Manage rooms</Link>
            <Link to="/guests" className="p-4 rounded-xl border border-line hover:border-ink transition-colors text-sm font-medium">Manage guests</Link>
            <Link to="/stay" className="p-4 rounded-xl border border-line hover:border-ink transition-colors text-sm font-medium">Check-in / out</Link>
            <Link to="/reports" className="p-4 rounded-xl border border-line hover:border-ink transition-colors text-sm font-medium">View reports</Link>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-ink text-paper">
            <p className="font-display font-semibold">Revenue summary</p>
            <p className="font-display text-3xl font-semibold mt-1">{currency(s.revenue)}</p>
            <p className="text-xs opacity-70 mt-1">Dummy data from {s.totalBookings} active bookings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
