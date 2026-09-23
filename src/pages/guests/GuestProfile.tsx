import { Link, useParams } from 'react-router-dom';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import { useHotel } from '@/context/HotelContext';
import { currency, shortDate } from '@/lib/format';

export default function GuestProfile() {
  const { id } = useParams();
  const { guestById, bookings, roomById } = useHotel();
  const guest = id ? guestById(id) : undefined;

  if (!guest) {
    return (
      <div>
        <PageHeader title="Guest not found" />
        <EmptyState title="Profile missing" hint="It may have been deleted." action={<Link to="/guests" className="btn-secondary px-4 py-1.5 text-xs mt-4 inline-block">Back to guests</Link>} />
      </div>
    );
  }

  const stays = bookings.filter((b) => b.guestId === guest.id);

  return (
    <div>
      <PageHeader title={guest.fullName} subtitle={guest.email} action={<Link to="/guests" className="btn-ghost border border-line">← All guests</Link>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <p className="mini-tag mb-3">PROFILE</p>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">Mobile:</span> {guest.mobile}</p>
            <p><span className="text-slate">Address:</span> {guest.address}</p>
            <p><span className="text-slate">ID proof:</span> {guest.idProof}</p>
            <p><span className="text-slate">Nationality:</span> {guest.nationality}</p>
            <p><span className="text-slate">Since:</span> {shortDate(guest.createdAt)}</p>
          </div>
        </div>
        <div className="card">
          <p className="mini-tag mb-3">BOOKINGS ({stays.length})</p>
          {stays.length === 0 ? (
            <p className="text-sm text-slate">No bookings for this guest yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {stays.map((b) => (
                <div key={b.id} className="py-2 text-sm flex items-center gap-2">
                  <p className="flex-1">Room {roomById(b.roomId)?.number} · {shortDate(b.checkIn)} → {shortDate(b.checkOut)} · {currency(b.total)}</p>
                  <Badge value={b.status} />
                </div>
              ))}
            </div>
          )}
          <Link to="/book" className="btn-outline w-full mt-4 py-2 text-xs">+ New booking for {guest.fullName.split(' ')[0]}</Link>
        </div>
      </div>
    </div>
  );
}
