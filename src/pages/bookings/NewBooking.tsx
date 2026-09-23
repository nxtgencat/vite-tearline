import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Badge from '@/components/Badge';
import PageHeader from '@/components/PageHeader';
import { useHotel } from '@/context/HotelContext';
import { currency, nightsBetween, todayISO } from '@/lib/format';

export default function NewBooking() {
  const { guests, rooms, createBooking, isRoomFree } = useHotel();
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState(guests[0]?.id ?? '');
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(todayISO());

  const room = rooms.find((r) => r.id === roomId);
  const nights = nightsBetween(checkIn, checkOut);
  const total = room ? nights * room.price : 0;

  const freeRooms = useMemo(() => {
    if (!checkIn || !checkOut || nights <= 0) return rooms;
    return rooms.filter((r) => isRoomFree(r.id, checkIn, checkOut));
  }, [rooms, checkIn, checkOut, nights, isRoomFree]);

  function handleConfirm() {
    if (!guestId) {
      toast.error('Select a guest first.');
      return;
    }
    if (!roomId) {
      toast.error('Select a room first.');
      return;
    }
    const err = createBooking(guestId, roomId, checkIn, checkOut);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success('Booking confirmed!');
    navigate('/history');
  }

  return (
    <div>
      <PageHeader title="New booking" subtitle="Pick a guest, room and dates. Totals update automatically." />
      {guests.length === 0 && <p className="text-sm text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2 mb-4">No guests yet. Add one from the Guests page first.</p>}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card space-y-4">
          <label className="block text-sm font-medium">Guest
            <select value={guestId} onChange={(e) => setGuestId(e.target.value)} className="field mt-1">
              <option value="">Select guest...</option>
              {guests.map((g) => <option key={g.id} value={g.id}>{g.fullName} · {g.email}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">Check-in
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="field mt-1" />
            </label>
            <label className="block text-sm font-medium">Check-out
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="field mt-1" />
            </label>
          </div>
          <label className="block text-sm font-medium">Room ({freeRooms.length} free for dates)
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="field mt-1">
              <option value="">Select room...</option>
              {freeRooms.map((r) => <option key={r.id} value={r.id}>Room {r.number} · {r.type} · {currency(r.price)}/night</option>)}
            </select>
          </label>
          {room && <div className="flex gap-2"><Badge value={room.type} /><Badge value={room.available ? 'available' : 'occupied'} /></div>}
        </div>
        <div className="card">
          <p className="mini-tag mb-3">BOOKING SUMMARY</p>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">Guest:</span> {guests.find((g) => g.id === guestId)?.fullName ?? '-'}</p>
            <p><span className="text-slate">Room:</span> {room ? `${room.number} (${room.type})` : '-'}</p>
            <p><span className="text-slate">Dates:</span> {checkIn} → {checkOut}</p>
            <p><span className="text-slate">Nights:</span> {nights} (auto calculated)</p>
            <p className="font-display font-semibold text-2xl pt-2">Total: {currency(total)}</p>
            <p className="text-xs text-slate">Status on confirm: confirmed. Double booking is blocked automatically.</p>
          </div>
          <button onClick={handleConfirm} className="btn-primary w-full mt-4">Confirm booking</button>
        </div>
      </div>
    </div>
  );
}
