import { useMemo } from 'react';
import { todayISO } from '@/lib/format';
import type { Booking, Guest, Room } from '@/lib/types';

export function useDashboard(rooms: Room[], guests: Guest[], bookings: Booking[]) {
  return useMemo(() => {
    const today = todayISO();
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => r.available).length;
    const occupiedRooms = totalRooms - availableRooms;
    const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
    const checkIns = bookings.filter((b) => b.checkIn === today && b.status !== 'cancelled');
    const checkOuts = bookings.filter((b) => b.checkOut === today && b.status !== 'cancelled');
    const revenue = activeBookings.reduce((sum, b) => sum + b.total, 0);
    const recent = [...bookings].slice(0, 5);
    const occupancy = totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);
    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalGuests: guests.length,
      checkIns: checkIns.length,
      checkOuts: checkOuts.length,
      totalBookings: activeBookings.length,
      revenue,
      recent,
      occupancy,
    };
  }, [rooms, guests, bookings]);
}
