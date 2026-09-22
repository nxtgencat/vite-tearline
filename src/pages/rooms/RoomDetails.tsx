import { Link, useParams } from 'react-router-dom';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useHotel } from '@/context/HotelContext';
import { currency } from '@/lib/format';

export default function RoomDetails() {
  const { id } = useParams();
  const { roomById, bookings, guestById } = useHotel();
  const room = id ? roomById(id) : undefined;

  if (!room) {
    return (
      <div>
        <PageHeader title="Room not found" />
        <EmptyState title="This room does not exist" hint="It may have been deleted." action={<Link to="/rooms" className="btn-secondary px-4 py-1.5 text-xs mt-4 inline-block">Back to rooms</Link>} />
      </div>
    );
  }

  const stays = bookings.filter((b) => b.roomId === room.id);

  return (
    <div>
      <PageHeader title={`Room ${room.number}`} subtitle={`${room.type} · Floor ${room.floor}`} action={<Link to="/rooms" className="btn-ghost border border-line">← All rooms</Link>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <img src={room.image} alt={`Room ${room.number}`} className="w-full h-72 object-cover rounded-xl border border-line" />
        <div className="card">
          <div className="flex items-center gap-2">
            <Badge value={room.available ? 'available' : 'occupied'} />
            <Badge value={room.type} />
          </div>
          <p className="font-display text-3xl font-semibold mt-3">{currency(room.price)} <span className="text-sm font-normal text-slate">/ night</span></p>
          <p className="text-sm text-slate mt-2">{room.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <p><span className="text-slate">Capacity:</span> {room.capacity} guests</p>
            <p><span className="text-slate">Floor:</span> {room.floor}</p>
          </div>
          <p className="mini-tag mt-4 mb-2">AMENITIES</p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => <span key={a} className="px-2.5 py-1 rounded-full bg-ink/5 text-xs">{a}</span>)}
          </div>
          <Link to="/book" className="btn-primary w-full mt-6">Book this room</Link>
        </div>
      </div>
      <div className="card mt-4">
        <p className="mini-tag mb-3">STAY HISTORY FOR THIS ROOM</p>
        {stays.length === 0 ? (
          <p className="text-sm text-slate">No bookings yet for this room.</p>
        ) : (
          <div className="divide-y divide-line">
            {stays.map((b) => (
              <div key={b.id} className="py-2 text-sm flex items-center gap-3">
                <p className="flex-1">{guestById(b.guestId)?.fullName ?? b.guestId} · {b.checkIn} → {b.checkOut}</p>
                <Badge value={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
