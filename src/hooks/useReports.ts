import { useMemo } from "react";
import { useCars } from "@/contexts/CarContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useBookings } from "@/contexts/BookingContext";

export function useReports() {
  const { cars } = useCars();
  const { customers } = useCustomers();
  const { bookings } = useBookings();

  return useMemo(() => {
    const valid = bookings.filter((b) => b.status !== "cancelled");
    const totalRevenue = valid.reduce((s, b) => s + b.totalCost, 0);
    const totalBookings = bookings.length;

    const countByCar = new Map<string, number>();
    for (const b of valid) countByCar.set(b.carId, (countByCar.get(b.carId) || 0) + 1);
    let mostRentedId = "";
    let mostRentedCount = 0;
    countByCar.forEach((n, id) => {
      if (n > mostRentedCount) {
        mostRentedCount = n;
        mostRentedId = id;
      }
    });
    const mostRented = cars.find((c) => c.id === mostRentedId) || null;

    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const key = d.toLocaleString("en-US", { month: "short" });
      const month = d.getMonth();
      const year = d.getFullYear();
      const total = valid
        .filter((b) => {
          const bd = new Date(b.createdAt);
          return bd.getMonth() === month && bd.getFullYear() === year;
        })
        .reduce((s, b) => s + b.totalCost, 0);
      const count = valid.filter((b) => {
        const bd = new Date(b.createdAt);
        return bd.getMonth() === month && bd.getFullYear() === year;
      }).length;
      return { month: key, revenue: total, count };
    });

    const maxRevenue = Math.max(1, ...monthly.map((m) => m.revenue));

    return { totalRevenue, totalBookings, mostRented, mostRentedCount, activeCustomers: customers.length, monthly, maxRevenue };
  }, [cars, customers, bookings]);
}
