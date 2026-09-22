import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchRooms } from '@/lib/api';
import { nightsBetween, rangesOverlap } from '@/lib/format';
import { seedBookings, seedGuests, seedPayments } from '@/lib/seed';
import { KEYS, load, save, uid } from '@/lib/storage';
import type { Booking, BookingStatus, Guest, Payment, Room } from '@/lib/types';

interface HotelState {
  rooms: Room[];
  guests: Guest[];
  bookings: Booking[];
  payments: Payment[];
  roomsLoading: boolean;
  roomsError: string | null;
  roomSource: string;
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => Guest;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  createBooking: (guestId: string, roomId: string, checkIn: string, checkOut: string) => string | null;
  cancelBooking: (id: string) => void;
  completeBooking: (id: string) => void;
  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  roomById: (id: string) => Room | undefined;
  guestById: (id: string) => Guest | undefined;
  isRoomFree: (roomId: string, checkIn: string, checkOut: string, ignoreBookingId?: string) => boolean;
}

const HotelContext = createContext<HotelState | null>(null);

export function HotelProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [roomSource, setRoomSource] = useState('api');
  const [guests, setGuests] = useState<Guest[]>(() => load(KEYS.guests, seedGuests));
  const [bookings, setBookings] = useState<Booking[]>(() => load(KEYS.bookings, seedBookings()));
  const [payments, setPayments] = useState<Payment[]>(() => {
    const stored = load<Payment[]>(KEYS.payments, []);
    if (stored.length > 0) return stored;
    return seedPayments(load(KEYS.bookings, seedBookings()));
  });

  useEffect(() => {
    let active = true;
    fetchRooms().then(({ rooms: fetched, source }) => {
      if (!active) return;
      const override = load<Room[]>(KEYS.roomsOverride, []);
      const merged = fetched.map((r) => override.find((o) => o.id === r.id) ?? r);
      const custom = override.filter((o) => !fetched.some((r) => r.id === o.id));
      setRooms([...custom, ...merged]);
      setRoomSource(source);
      if (source === 'fallback') setRoomsError('Live API unreachable, showing cached rooms.');
      setRoomsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!roomsLoading) save(KEYS.roomsOverride, rooms);
  }, [rooms, roomsLoading]);

  useEffect(() => {
    save(KEYS.guests, guests);
  }, [guests]);

  useEffect(() => {
    save(KEYS.bookings, bookings);
  }, [bookings]);

  useEffect(() => {
    save(KEYS.payments, payments);
  }, [payments]);

  const value = useMemo<HotelState>(() => {
    function roomById(id: string) {
      return rooms.find((r) => r.id === id);
    }
    function guestById(id: string) {
      return guests.find((g) => g.id === id);
    }
    function isRoomFree(roomId: string, checkIn: string, checkOut: string, ignoreBookingId?: string): boolean {
      const room = roomById(roomId);
      if (!room || !room.available) return false;
      return !bookings.some((b) => {
        if (b.roomId !== roomId) return false;
        if (b.id === ignoreBookingId) return false;
        if (b.status === 'cancelled' || b.status === 'completed' || b.status === 'checked-out') return false;
        return rangesOverlap(b.checkIn, b.checkOut, checkIn, checkOut);
      });
    }
    return {
      rooms,
      guests,
      bookings,
      payments,
      roomsLoading,
      roomsError,
      roomSource,
      roomById,
      guestById,
      isRoomFree,
      addRoom: (room) => setRooms((prev) => [{ ...room, id: uid('room') }, ...prev]),
      updateRoom: (id, patch) => setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
      deleteRoom: (id) => setRooms((prev) => prev.filter((r) => r.id !== id)),
      addGuest: (guest) => {
        const created: Guest = { ...guest, id: uid('guest'), createdAt: new Date().toISOString() };
        setGuests((prev) => [created, ...prev]);
        return created;
      },
      updateGuest: (id, patch) => setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g))),
      deleteGuest: (id) => setGuests((prev) => prev.filter((g) => g.id !== id)),
      createBooking: (guestId, roomId, checkIn, checkOut) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return 'Room not found.';
        const nights = nightsBetween(checkIn, checkOut);
        if (nights <= 0) return 'Check-out must be after check-in.';
        const free = bookings.every((b) => {
          if (b.roomId !== roomId) return true;
          if (b.status === 'cancelled' || b.status === 'completed' || b.status === 'checked-out') return true;
          return !rangesOverlap(b.checkIn, b.checkOut, checkIn, checkOut);
        });
        if (!room.available || !free) return 'Room is already booked for these dates.';
        const total = nights * room.price;
        const booking: Booking = {
          id: uid('book'),
          guestId,
          roomId,
          checkIn,
          checkOut,
          nights,
          total,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        setBookings((prev) => [booking, ...prev]);
        setPayments((prev) => [
          { id: uid('pay'), bookingId: booking.id, guestId, amount: total, status: 'pending', method: 'Card', date: checkIn },
          ...prev,
        ]);
        return null;
      },
      cancelBooking: (id) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b)));
        setPayments((prev) => prev.map((p) => (p.bookingId === id ? { ...p, status: 'refunded' as const } : p)));
      },
      completeBooking: (id) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'completed' as BookingStatus } : b)));
        setPayments((prev) => prev.map((p) => (p.bookingId === id ? { ...p, status: 'paid' as const } : p)));
      },
      checkIn: (id) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'checked-in' as BookingStatus } : b)));
      },
      checkOut: (id) => {
        const target = bookings.find((b) => b.id === id);
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'checked-out' as BookingStatus } : b)));
        if (target) {
          setRooms((prev) => prev.map((r) => (r.id === target.roomId ? { ...r, available: true } : r)));
          setPayments((prev) => prev.map((p) => (p.bookingId === id ? { ...p, status: 'paid' as const } : p)));
        }
      },
    };
  }, [rooms, guests, bookings, payments, roomsLoading, roomsError, roomSource]);

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHotel(): HotelState {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used inside HotelProvider');
  return ctx;
}
