import { Link } from 'react-router-dom';
import Badge from '@/components/Badge';
import { currency } from '@/lib/format';
import type { Room } from '@/lib/types';

export default function RoomCard({ room }: { room: Room }) {
  return (
    <div className="card overflow-hidden !p-0">
      <img src={room.image} alt={`Room ${room.number}`} className="w-full h-40 object-cover" loading="lazy" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-semibold">Room {room.number}</p>
          <Badge value={room.available ? 'available' : 'occupied'} />
        </div>
        <p className="text-xs text-slate mt-0.5">{room.type} · Floor {room.floor} · Sleeps {room.capacity}</p>
        <p className="text-sm font-medium mt-2">{currency(room.price)} <span className="text-xs font-normal text-slate">/ night</span></p>
        <Link to={`/rooms/${room.id}`} className="btn-outline w-full mt-3 py-1.5 text-xs">View details</Link>
      </div>
    </div>
  );
}
