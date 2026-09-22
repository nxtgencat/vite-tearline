import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EmptyState from '@/components/EmptyState';
import Modal from '@/components/Modal';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import RoomCard from '@/components/RoomCard';
import SearchInput from '@/components/SearchInput';
import Skeleton from '@/components/Skeleton';
import Spinner from '@/components/Spinner';
import { useHotel } from '@/context/HotelContext';
import { usePagination } from '@/hooks/usePagination';
import type { Room, RoomType } from '@/lib/types';

const TYPES: Array<RoomType | 'All'> = ['All', 'Single', 'Double', 'Deluxe', 'Suite', 'Family'];

interface RoomForm {
  number: string;
  type: RoomType;
  price: number;
  capacity: number;
  floor: number;
  amenities: string;
  image: string;
  description: string;
  available: boolean;
}

const defaults: RoomForm = {
  number: '',
  type: 'Double',
  price: 120,
  capacity: 2,
  floor: 1,
  amenities: 'WiFi, TV, AC',
  image: '',
  description: '',
  available: true,
};

export default function RoomList() {
  const { rooms, roomsLoading, roomsError, roomSource, addRoom, updateRoom, deleteRoom } = useHotel();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('All');
  const [avail, setAvail] = useState<string>('All');
  const [sort, setSort] = useState<string>('none');
  const [modal, setModal] = useState<null | { mode: 'add' | 'edit'; room?: Room }>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomForm>({ defaultValues: defaults });

  const filtered = useMemo(() => {
    let list = rooms.filter((r) => {
      const q = query.toLowerCase();
      const matches = r.number.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      const typeOk = type === 'All' || r.type === type;
      const availOk = avail === 'All' || (avail === 'Available' ? r.available : !r.available);
      return matches && typeOk && availOk;
    });
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [rooms, query, type, avail, sort]);

  const { page, totalPages, pageItems, setPage } = usePagination(filtered, 6);

  function openAdd() {
    reset(defaults);
    setModal({ mode: 'add' });
  }

  function openEdit(room: Room) {
    reset({
      number: room.number,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      floor: room.floor,
      amenities: room.amenities.join(', '),
      image: room.image,
      description: room.description,
      available: room.available,
    });
    setModal({ mode: 'edit', room });
  }

  function onSubmit(values: RoomForm) {
    const payload = {
      number: values.number,
      type: values.type,
      price: Number(values.price),
      capacity: Number(values.capacity),
      floor: Number(values.floor),
      amenities: values.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      image: values.image || `https://picsum.photos/seed/hotel${values.number}/600/400`,
      description: values.description || `${values.type} room ${values.number}`,
      available: Boolean(values.available),
    };
    if (modal?.mode === 'edit' && modal.room) {
      updateRoom(modal.room.id, payload);
      toast.success(`Room ${values.number} updated.`);
    } else {
      addRoom(payload);
      toast.success(`Room ${values.number} added.`);
    }
    setModal(null);
  }

  function handleDelete(room: Room) {
    if (!confirm(`Delete room ${room.number}?`)) return;
    deleteRoom(room.id);
    toast.info(`Room ${room.number} deleted.`);
  }

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle={`Live data via DummyJSON (${roomSource}) with search, filter, sort and pagination.`}
        action={<button onClick={openAdd} className="btn-primary">+ Add room</button>}
      />
      {roomsError && <p className="text-xs text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2 mb-4">{roomsError}</p>}
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search number or type..." />
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="field !w-auto">
          {TYPES.map((t) => <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>)}
        </select>
        <select value={avail} onChange={(e) => { setAvail(e.target.value); setPage(1); }} className="field !w-auto">
          <option value="All">All status</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto">
          <option value="none">Sort: none</option>
          <option value="low">Price low → high</option>
          <option value="high">Price high → low</option>
        </select>
      </div>
      {roomsLoading ? (
        <Skeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No rooms found" hint="Try a different search or add a new room." action={<button onClick={openAdd} className="btn-secondary px-4 py-1.5 text-xs mt-4">Add room</button>} />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageItems.map((room) => (
              <div key={room.id} className="relative">
                <RoomCard room={room} />
                <div className="flex gap-2 px-4 pb-4 -mt-1 card !rounded-t-none !border-t-0">
                  <button onClick={() => openEdit(room)} className="btn-outline flex-1 py-1.5 text-xs">Edit</button>
                  <button onClick={() => handleDelete(room)} className="flex-1 py-1.5 text-xs rounded-full border border-rose/40 text-rose hover:bg-rose/10 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
      {roomsLoading && <Spinner label="Fetching rooms from DummyJSON..." />}
      {modal && (
        <Modal title={modal.mode === 'add' ? 'Add room' : `Edit room ${modal.room?.number}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Room number
              <input className="field mt-1" {...register('number', { required: 'Required' })} />
              {errors.number && <span className="text-xs text-rose">{errors.number.message}</span>}
            </label>
            <label className="block text-sm">Type
              <select className="field mt-1" {...register('type')}>
                <option>Single</option><option>Double</option><option>Deluxe</option><option>Suite</option><option>Family</option>
              </select>
            </label>
            <label className="block text-sm">Price / night
              <input type="number" className="field mt-1" {...register('price', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
            </label>
            <label className="block text-sm">Capacity
              <input type="number" className="field mt-1" {...register('capacity', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
            </label>
            <label className="block text-sm">Floor
              <input type="number" className="field mt-1" {...register('floor', { required: 'Required', min: { value: 1, message: 'Min 1' } })} />
            </label>
            <label className="block text-sm">Available
              <select className="field mt-1" {...register('available')}>
                <option value="true">Yes</option><option value="false">No</option>
              </select>
            </label>
            <label className="block text-sm col-span-2">Amenities (comma separated)
              <input className="field mt-1" {...register('amenities')} />
            </label>
            <label className="block text-sm col-span-2">Image URL (optional)
              <input className="field mt-1" placeholder="https://..." {...register('image')} />
            </label>
            <label className="block text-sm col-span-2">Description
              <input className="field mt-1" {...register('description')} />
            </label>
            <button type="submit" className="btn-primary col-span-2">Save room</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
