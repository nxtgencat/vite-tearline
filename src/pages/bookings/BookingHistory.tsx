import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import { useHotel } from '@/context/HotelContext';
import { usePagination } from '@/hooks/usePagination';
import { currency, shortDate } from '@/lib/format';

export default function BookingHistory() {
  const { bookings, guestById, roomById, cancelBooking, completeBooking } = useHotel();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return bookings.filter((b) => {
      const guest = guestById(b.guestId)?.fullName.toLowerCase() ?? '';
      const room = roomById(b.roomId)?.number ?? '';
      const okQ = guest.includes(q) || room.includes(q) || b.id.toLowerCase().includes(q);
      const okS = status === 'All' || b.status === status;
      const okD = !date || (b.checkIn <= date && date <= b.checkOut);
      return okQ && okS && okD;
    });
  }, [bookings, query, status, date, guestById, roomById]);

  const { page, totalPages, pageItems, setPage } = usePagination(filtered, 8);

  return (
    <div>
      <PageHeader title="Booking history" subtitle="Search, filter by date and status, cancel or complete stays." action={<Link to="/book" className="btn-primary">+ New booking</Link>} />
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search guest, room, id..." />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="field !w-auto">
          <option value="All">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked-in">Checked-in</option>
          <option value="checked-out">Checked-out</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} className="field !w-auto" />
        {date && <button onClick={() => setDate('')} className="btn-ghost border border-line">Clear date</button>}
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No bookings found" hint="Adjust filters or create a new booking." />
      ) : (
        <>
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead><tr className="text-left text-xs text-slate border-b border-line">
                  <th className="px-4 py-3 font-medium">Booking</th><th className="px-4 py-3 font-medium">Dates</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-line">
                  {pageItems.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3"><Link to={`/history/${b.id}`} className="font-medium text-cobalt">{b.id.slice(0, 14)}</Link><p className="text-xs text-slate">{guestById(b.guestId)?.fullName} · Room {roomById(b.roomId)?.number}</p></td>
                      <td className="px-4 py-3 text-xs">{shortDate(b.checkIn)} → {shortDate(b.checkOut)} ({b.nights}n)</td>
                      <td className="px-4 py-3 font-medium">{currency(b.total)}</td>
                      <td className="px-4 py-3"><Badge value={b.status} /></td>
                      <td className="px-4 py-3"><div className="flex gap-2 justify-end">
                        {(b.status === 'confirmed' || b.status === 'checked-in') && (
                          <button
                            onClick={() => { cancelBooking(b.id); toast.info('Booking cancelled and refunded.'); }}
                            className="text-xs px-3 py-1 rounded-full border border-rose/40 text-rose hover:bg-rose/10"
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === 'checked-out' && (
                          <button
                            onClick={() => { completeBooking(b.id); toast.success('Booking marked completed.'); }}
                            className="text-xs px-3 py-1 rounded-full border border-mint/40 text-mint hover:bg-mint/10"
                          >
                            Complete
                          </button>
                        )}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
