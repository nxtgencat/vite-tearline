import { useMemo } from "react";
import { useCars } from "@/contexts/CarContext";
import { useCustomers } from "@/contexts/CustomerContext";
import { useBookings } from "@/contexts/BookingContext";

export function useDashboardStats() {
  const { cars } = useCars();
  const { customers } = useCustomers();
  const { bookings } = useBookings();

  return useMemo(() => {
    const totalCars = cars.length;
    const available = cars.filter((c) => c.status === "available").length;
    const booked = cars.filter((c) => c.status === "rented").length;
    const activeRentals = bookings.filter((b) => b.status === "active").length;
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.totalCost, 0);
    const recent = [...bookings].slice(0, 5);
    return { totalCars, available, booked, customers: customers.length, activeRentals, revenue, recent };
  }, [cars, customers, bookings]);
}
