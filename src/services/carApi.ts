import axios from "axios";
import { seedCars } from "@/lib/seed";
import type { Car, FuelType, Transmission } from "@/lib/types";

interface DummyProduct {
  id: number;
  title: string;
  brand?: string;
  price: number;
  thumbnail: string;
  stock: number;
}

const fuels: FuelType[] = ["Petrol", "Diesel", "Electric", "Hybrid"];
const gears: Transmission[] = ["Automatic", "Manual"];
const seatings = [4, 5, 5, 5, 7];

function mapProduct(p: DummyProduct): Car {
  return {
    id: `api_${p.id}`,
    brand: p.brand || "Generic",
    model: p.title,
    year: 2019 + (p.id % 6),
    pricePerDay: Math.max(29, Math.round(p.price / 2) + 30),
    fuelType: fuels[p.id % fuels.length],
    transmission: gears[p.id % gears.length],
    seating: seatings[p.id % seatings.length],
    status: p.stock > 5 ? "available" : "maintenance",
    image: p.thumbnail,
  };
}

export async function fetchCarsFromAPI(): Promise<Car[]> {
  const res = await axios.get<{ products: DummyProduct[] }>(
    "https://dummyjson.com/products?limit=12&select=title,brand,price,thumbnail,stock"
  );
  return res.data.products.map(mapProduct);
}

export function fallbackCars(): Car[] {
  return seedCars;
}
