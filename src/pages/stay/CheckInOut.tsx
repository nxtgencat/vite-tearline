import { toast } from 'react-toastify';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useHotel } from '@/context/HotelContext';
import { shortDate, stayDuration } from '@/lib/format';

export default function CheckInOut() {
  const { bookings, guestById, roomById, checkIn, checkOut } = useHotel();

  const arrivals = bookings.filter((b) => b.status === 'confirmed');
  const staying = bookings.filter((b) => b.status === 'checked-in');
  const departed = bookings.filter((b) => b.status === 'checked-out');

  function doCheckIn(id: string) {
    checkIn(id);
    toast.success('Guest checked in. Room marked occupied.');
  }

  function doCheckOut(id: string) {
    checkOut(id);
    toast.success('Guest checked out. Room freed.');
  }

  return (
    <div>
      <PageHeader title="Check-in / Check-out" subtitle="Arrivals, current stays and departure history with stay duration." />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="mini-tag mb-3">ARRIVALS ({arrivals.length})</p>
          {arrivals.length === 0 ? <EmptyState title="No arrivals" hint="Confirmed bookings appear here." /> : (
            <div className="space-y-2">
              {arrivals.map((b) => (
                <div key={b.id} className="p-3 rounded-xl border border-line text-sm flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{guestById(b.guestId)?.fullName} · Room {roomById(b.roomId)?.number}</p>
                    <p className="text-xs text-slate">{shortDate(b.checkIn)} → {shortDate(b.checkOut)} · {stayDuration(b.checkIn, b.checkOut)}</p>
                  </div>
                  <button onClick={() => doCheckIn(b.id)} className="btn-primary px-4 py-1.5 text-xs">Check-in</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <p className="mini-tag mb-3">CURRENT STAYS ({staying.length})</p>
          {staying.length === 0 ? <EmptyState title="No active stays" hint="Checked-in guests appear here." /> : (
            <div className="space-y-2">
              {staying.map((b) => (
                <div key={b.id} className="p-3 rounded-xl border border-line text-sm flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{guestById(b.guestId)?.fullName} · Room {roomById(b.roomId)?.number}</p>
                    <p className="text-xs text-slate">{shortDate(b.checkIn)} → {shortDate(b.checkOut)} · {stayDuration(b.checkIn, b.checkOut)}</p>
                  </div>
                  <button onClick={() => doCheckOut(b.id)} className="btn-secondary px-4 py-1.5 text-xs">Check-out</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="card mt-4">
        <p className="mini-tag mb-3">CHECK-OUT HISTORY ({departed.length})</p>
        {departed.length === 0 ? (
          <p className="text-sm text-slate">No departures yet.</p>
        ) : (
          <div className="divide-y divide-line">
            {departed.map((b) => (
              <div key={b.id} className="py-2 text-sm flex items-center gap-3">
                <p className="flex-1">{guestById(b.guestId)?.fullName} · Room {roomById(b.roomId)?.number} · {stayDuration(b.checkIn, b.checkOut)}</p>
                <Badge value={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
