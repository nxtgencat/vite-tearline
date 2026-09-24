import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import StatCard from '@/components/StatCard';
import { useHotel } from '@/context/HotelContext';
import { currency, shortDate } from '@/lib/format';
import type { Payment } from '@/lib/types';

export default function Payments() {
  const { payments, guestById, bookings, roomById } = useHotel();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [invoice, setInvoice] = useState<Payment | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return payments.filter((p) => {
      const guest = guestById(p.guestId)?.fullName.toLowerCase() ?? '';
      const okQ = guest.includes(q) || p.bookingId.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const okS = status === 'All' || p.status === status;
      return okQ && okS;
    });
  }, [payments, query, status, guestById]);

  const collected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Summary, history, invoice preview and dummy download." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <StatCard label="Collected" value={currency(collected)} hint="Paid invoices" />
        <StatCard label="Pending" value={currency(pending)} hint="Awaiting payment" />
        <StatCard label="Records" value={String(payments.length)} hint="All payment rows" />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search guest, booking, payment..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field !w-auto">
          <option value="All">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No payments found" hint="Try a different search or status." />
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead><tr className="text-left text-xs text-slate border-b border-line">
                <th className="px-4 py-3 font-medium">Payment</th><th className="px-4 py-3 font-medium">Guest</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Invoice</th>
              </tr></thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3"><p className="font-medium">{p.id}</p><p className="text-xs text-slate">{shortDate(p.date)} · {p.method}</p></td>
                    <td className="px-4 py-3">{guestById(p.guestId)?.fullName ?? '-'}</td>
                    <td className="px-4 py-3 font-medium">{currency(p.amount)}</td>
                    <td className="px-4 py-3"><Badge value={p.status} /></td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setInvoice(p)} className="text-xs px-3 py-1 rounded-full border border-line hover:border-ink">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {invoice && (
        <Modal title={`Invoice ${invoice.id}`} onClose={() => setInvoice(null)}>
          <div className="border border-dashed border-line rounded-xl p-5 text-sm">
            <div className="flex justify-between">
              <p className="font-display font-semibold">Harbor Stay</p>
              <Badge value={invoice.status} />
            </div>
            <div className="mt-4 space-y-1.5">
              <p><span className="text-slate">Guest:</span> {guestById(invoice.guestId)?.fullName}</p>
              <p><span className="text-slate">Booking:</span> {invoice.bookingId}</p>
              <p><span className="text-slate">Room:</span> {roomById(bookings.find((b) => b.id === invoice.bookingId)?.roomId ?? '')?.number ?? '-'}</p>
              <p><span className="text-slate">Date:</span> {shortDate(invoice.date)} · {invoice.method}</p>
              <p className="font-display font-semibold text-2xl pt-2">Due: {currency(invoice.amount)}</p>
            </div>
            <button onClick={() => toast.info('Invoice download is a UI demo only.')} className="btn-secondary w-full mt-5">Download invoice (demo)</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
