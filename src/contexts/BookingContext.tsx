import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON } from "@/lib/storage";
import type { Booking, BookingStatus } from "@/lib/types";
import { uid } from "@/lib/rental";
import { fetchBookingsFromAPI, addBookingToAPI, deleteBookingFromAPI } from "@/services/bookingApi";

interface BookingCtx {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  setStatus: (id: string, status: BookingStatus) => void;
  removeBooking: (id: string) => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => readJSON<Booking[]>(keys.bookings, []));
  const [loading, setLoading] = useState(bookings.length < 10);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const cached = readJSON<Booking[]>(keys.bookings, []);
    // Old cache had a handful of local bookings — refetch 150+ from carts
    const apiCount = cached.filter((b) => b.id.startsWith("api_booking_")).length;
    if (apiCount >= 50 && tick === 0) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    fetchBookingsFromAPI(50)
      .then((list) => {
        if (!alive) return;
        // Keep user-created bookings across refetch
        const locals = readJSON<Booking[]>(keys.bookings, []).filter(
          (b) => !b.id.startsWith("api_booking_")
        );
        const merged = [...locals, ...list];
        setBookings(merged);
        writeJSON(keys.bookings, merged);
      })
      .catch(() => {
        if (!alive) return;
        setError("Live API unreachable, showing cached bookings.");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  function save(next: Booking[]) {
    setBookings(next);
    writeJSON(keys.bookings, next);
  }

  return (
    <Ctx.Provider
      value={{
        bookings,
        loading,
        error,
        reload: () => setTick((t) => t + 1),
        addBooking: (b) => {
          const nb: Booking = { ...b, id: uid("book"), status: "active", createdAt: new Date().toISOString() };
          save([nb, ...bookings]);
          // Simulated POST — visible in DevTools Network
          addBookingToAPI(b.customerId, b.carId).catch(() => {});
          return nb;
        },
        setStatus: (id, status) => save(bookings.map((b) => (b.id === id ? { ...b, status } : b))),
        removeBooking: (id) => {
          save(bookings.filter((b) => b.id !== id));
          deleteBookingFromAPI(id).catch(() => {});
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBookings(): BookingCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBookings outside provider");
  return v;
}
