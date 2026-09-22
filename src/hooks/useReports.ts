import { useMemo } from 'react';
import type { Booking, Room } from '@/lib/types';

export function useReports(bookings: Booking[], rooms: Room[]) {
  return useMemo(() => {
    const active = bookings.filter((b) => b.status !== 'cancelled');
    const totalRevenue = active.reduce((sum, b) => sum + b.total, 0);
    const byType: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    active.forEach((b) => {
      const room = rooms.find((r) => r.id === b.roomId);
      const type = room ? room.type : 'Unknown';
      byType[type] = (byType[type] ?? 0) + 1;
      const month = b.createdAt.slice(0, 7);
      byMonth[month] = (byMonth[month] ?? 0) + 1;
    });
    const mostBooked = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
    const occupancy = rooms.length === 0 ? 0 : Math.round((rooms.filter((r) => !r.available).length / rooms.length) * 100);
    const trend = Object.entries(byMonth).sort().slice(-6);
    const maxTrend = Math.max(1, ...trend.map(([, v]) => v));
    return { totalRevenue, byType, byMonth, mostBooked, occupancy, trend, maxTrend, monthlyCount: active.length };
  }, [bookings, rooms]);
}
