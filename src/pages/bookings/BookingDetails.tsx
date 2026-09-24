import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useHotel } from '@/context/HotelContext';
import { currency, shortDate, stayDuration } from '@/lib/format';

export default function BookingDetails() {
  const { id } = useParams();
  const { bookings, guestById, roomById, cancelBooking, completeBooking } = useHotel();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div>
        <PageHeader title="Booking not found" />
        <EmptyState title="Missing booking" hint="It may have been removed." action={<Link to="/history" className="btn-secondary px-4 py-1.5 text-xs mt-4 inline-block">Back to history</Link>} />
      </div>
    );
  }

  const guest = guestById(booking.guestId);
  const room = roomById(booking.roomId);

  return (
    <div>
      <PageHeader title={`Booking ${booking.id.slice(0, 14)}`} subtitle="Full stay details." action={<Link to="/history" className="btn-ghost border border-line">← All bookings</Link>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-3"><Badge value={booking.status} /><span className="text-xs text-slate">{stayDuration(booking.checkIn, booking.checkOut)}</span></div>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">Guest:</span> {guest?.fullName ?? '-'}</p>
            <p><span className="text-slate">Room:</span> {room ? `${room.number} (${room.type})` : '-'}</p>
            <p><span className="text-slate">Check-in:</span> {shortDate(booking.checkIn)}</p>
            <p><span className="text-slate">Check-out:</span> {shortDate(booking.checkOut)}</p>
            <p><span className="text-slate">Nights:</span> {booking.nights}</p>
            <p className="font-display font-semibold text-2xl pt-1">Total: {currency(booking.total)}</p>
          </div>
          <div className="flex gap-2 mt-4">
            {(booking.status === 'confirmed' || booking.status === 'checked-in') && (
              <button onClick={() => { cancelBooking(booking.id); toast.info('Booking cancelled.'); }} className="flex-1 py-2 text-xs rounded-full border border-rose/40 text-rose hover:bg-rose/10">Cancel booking</button>
            )}
            {booking.status === 'checked-out' && (
              <button onClick={() => { completeBooking(booking.id); toast.success('Booking completed.'); }} className="flex-1 py-2 text-xs rounded-full border border-mint/40 text-mint hover:bg-mint/10">Mark completed</button>
            )}
          </div>
        </div>
        {room && <img src={room.image} alt={`Room ${room.number}`} className="w-full h-64 object-cover rounded-xl border border-line" />}
      </div>
    </div>
  );
}
