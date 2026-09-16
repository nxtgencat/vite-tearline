import axios from "axios";
import { priceForProduct } from "@/services/carApi";
import type { Booking, BookingStatus } from "@/lib/types";

interface DummyCartProduct {
  id: number;
  quantity: number;
  total: number;
}

interface DummyCart {
  id: number;
  userId: number;
  products: DummyCartProduct[];
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function statusFor(idx: number): BookingStatus {
  if (idx % 7 === 6) return "cancelled";
  if (idx % 3 === 2) return "completed";
  return "active";
}

// MANY bookings: 50 carts x up to 4 products ≈ 150+ rentals.
// carId/customerId are folded into the 1–100 range so they always
// resolve to a loaded car/customer.
export async function fetchBookingsFromAPI(cartLimit = 50): Promise<Booking[]> {
  const res = await axios.get<{ carts: DummyCart[] }>(
    `https://dummyjson.com/carts?limit=${cartLimit}&skip=0&select=id,userId,products`
  );
  const out: Booking[] = [];
  const today = new Date();
  let idx = 0;
  for (const cart of res.data.carts) {
    const custN = ((cart.userId - 1) % 100) + 1;
    for (const p of cart.products.slice(0, 4)) {
      const carN = ((p.id - 1) % 100) + 1;
      const days = (p.quantity % 7) + 1;
      const pickup = new Date(today);
      pickup.setDate(pickup.getDate() - ((cart.id * 3 + idx * 2) % 60));
      const ret = new Date(pickup);
      ret.setDate(ret.getDate() + days);
      const totalCost = days * priceForProduct(carN);
      out.push({
        id: `api_booking_${cart.id}_${p.id}_${idx}`,
        customerId: `user_${custN}`,
        carId: `api_${carN}`,
        pickupDate: toISO(pickup),
        returnDate: toISO(ret),
        days,
        totalCost,
        status: statusFor(idx),
        createdAt: toISO(pickup),
      });
      idx += 1;
    }
  }
  return out;
}

// --- DummyJSON writes (simulated, visible in Network) ---

export async function addBookingToAPI(customerId: string, carId: string) {
  const userN = Number(customerId.replace("user_", "")) || 1;
  const carN = Number(carId.replace("api_", "")) || 1;
  const res = await axios.post("https://dummyjson.com/carts/add", {
    userId: userN,
    products: [{ id: carN, quantity: 1 }],
  });
  return res.data;
}

export async function deleteBookingFromAPI(id: string) {
  const m = id.match(/^api_booking_(\d+)_/);
  if (!m) return null;
  const res = await axios.delete(`https://dummyjson.com/carts/${m[1]}`);
  return res.data;
}
