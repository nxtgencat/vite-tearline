import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { keys, readJSON, writeJSON } from "@/lib/storage";
import type { Booking, BookingStatus } from "@/lib/types";
import { uid } from "@/lib/rental";

interface BookingCtx {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  setStatus: (id: string, status: BookingStatus) => void;
  removeBooking: (id: string) => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => readJSON<Booking[]>(keys.bookings, []));

  function save(next: Booking[]) {
    setBookings(next);
    writeJSON(keys.bookings, next);
  }

  return (
    <Ctx.Provider
      value={{
        bookings,
        addBooking: (b) => {
          const nb: Booking = { ...b, id: uid("book"), status: "active", createdAt: new Date().toISOString() };
          save([nb, ...bookings]);
          return nb;
        },
        setStatus: (id, status) => save(bookings.map((b) => (b.id === id ? { ...b, status } : b))),
        removeBooking: (id) => save(bookings.filter((b) => b.id !== id)),
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
