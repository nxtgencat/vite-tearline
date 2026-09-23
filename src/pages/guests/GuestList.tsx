import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import { useHotel } from '@/context/HotelContext';
import { usePagination } from '@/hooks/usePagination';
import type { Guest } from '@/lib/types';

interface GuestForm {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  idProof: string;
  nationality: string;
}

const empty: GuestForm = { fullName: '', email: '', mobile: '', address: '', idProof: '', nationality: '' };

export default function GuestList() {
  const { guests, addGuest, updateGuest, deleteGuest } = useHotel();
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<null | { mode: 'add' | 'edit'; guest?: Guest }>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GuestForm>({ defaultValues: empty });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return guests.filter((g) => g.fullName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.mobile.includes(q));
  }, [guests, query]);

  const { page, totalPages, pageItems, setPage } = usePagination(filtered, 6);

  function openAdd() {
    reset(empty);
    setModal({ mode: 'add' });
  }

  function openEdit(guest: Guest) {
    reset({ fullName: guest.fullName, email: guest.email, mobile: guest.mobile, address: guest.address, idProof: guest.idProof, nationality: guest.nationality });
    setModal({ mode: 'edit', guest });
  }

  function onSubmit(values: GuestForm) {
    if (modal?.mode === 'edit' && modal.guest) {
      updateGuest(modal.guest.id, values);
      toast.success('Guest updated.');
    } else {
      addGuest(values);
      toast.success('Guest added.');
    }
    setModal(null);
  }

  function handleDelete(g: Guest) {
    if (!confirm(`Delete ${g.fullName}?`)) return;
    deleteGuest(g.id);
    toast.info('Guest deleted.');
  }

  return (
    <div>
      <PageHeader title="Guests" subtitle={`${filtered.length} profiles with search and pagination.`} action={<button onClick={openAdd} className="btn-primary">+ Add guest</button>} />
      <div className="mb-4"><SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search name, email, mobile..." /></div>
      {filtered.length === 0 ? (
        <EmptyState title="No guests found" hint="Add your first guest profile." action={<button onClick={openAdd} className="btn-secondary px-4 py-1.5 text-xs mt-4">Add guest</button>} />
      ) : (
        <>
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead><tr className="text-left text-xs text-slate border-b border-line">
                  <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Contact</th><th className="px-4 py-3 font-medium">Nationality</th><th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-line">
                  {pageItems.map((g) => (
                    <tr key={g.id} className="hover:bg-ink/[.02]">
                      <td className="px-4 py-3"><Link to={`/guests/${g.id}`} className="font-medium text-cobalt">{g.fullName}</Link><p className="text-xs text-slate">{g.idProof}</p></td>
                      <td className="px-4 py-3"><p>{g.email}</p><p className="text-xs text-slate">{g.mobile}</p></td>
                      <td className="px-4 py-3">{g.nationality}</td>
                      <td className="px-4 py-3"><div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(g)} className="text-xs px-3 py-1 rounded-full border border-line hover:border-ink">Edit</button>
                        <button onClick={() => handleDelete(g)} className="text-xs px-3 py-1 rounded-full border border-rose/40 text-rose hover:bg-rose/10">Delete</button>
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
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add guest' : 'Edit guest'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-sm">Full name
              <input className="field mt-1" {...register('fullName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.fullName && <span className="text-xs text-rose">{errors.fullName.message}</span>}
            </label>
            <label className="block text-sm">Email
              <input className="field mt-1" {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
            </label>
            <label className="block text-sm">Mobile
              <input className="field mt-1" {...register('mobile', { required: 'Required', minLength: { value: 7, message: 'Too short' } })} />
              {errors.mobile && <span className="text-xs text-rose">{errors.mobile.message}</span>}
            </label>
            <label className="block text-sm">Nationality
              <input className="field mt-1" {...register('nationality', { required: 'Required' })} />
              {errors.nationality && <span className="text-xs text-rose">{errors.nationality.message}</span>}
            </label>
            <label className="block text-sm">ID proof
              <input className="field mt-1" {...register('idProof', { required: 'Required' })} />
              {errors.idProof && <span className="text-xs text-rose">{errors.idProof.message}</span>}
            </label>
            <label className="block text-sm">Address
              <input className="field mt-1" {...register('address', { required: 'Required' })} />
              {errors.address && <span className="text-xs text-rose">{errors.address.message}</span>}
            </label>
            <button type="submit" className="btn-primary sm:col-span-2">Save guest</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
