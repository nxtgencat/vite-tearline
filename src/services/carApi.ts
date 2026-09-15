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
    // Vehicle prices are ~$25k-37k, so scale to a daily rental rate
    pricePerDay: Math.max(49, Math.round(p.price / 400)),
    fuelType: fuels[p.id % fuels.length],
    transmission: gears[p.id % gears.length],
    seating: seatings[p.id % seatings.length],
    status: p.stock > 5 ? "available" : "maintenance",
    image: p.thumbnail,
  };
}

export async function fetchCarsFromAPI(): Promise<Car[]> {
  const res = await axios.get<{ products: DummyProduct[] }>(
    "https://dummyjson.com/products/category/vehicle?select=title,brand,price,thumbnail,stock"
  );
  return res.data.products.map(mapProduct);
}

// --- DummyJSON writes (simulated by DummyJSON, but visible in Network) ---

function parseApiId(id: string): number | null {
  if (!id.startsWith("api_")) return null; // local_ cars don't exist on DummyJSON
  const n = Number(id.slice(4));
  return Number.isFinite(n) ? n : null;
}

function toDummyPayload(patch: Partial<Car>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (patch.model !== undefined) out.title = patch.model;
  if (patch.brand !== undefined) out.brand = patch.brand;
  if (patch.pricePerDay !== undefined) out.price = patch.pricePerDay;
  if (patch.image !== undefined) out.thumbnail = patch.image;
  if (patch.status !== undefined) out.stock = patch.status === "available" ? 10 : 0;
  return out;
}

export async function addCarToAPI(car: Omit<Car, "id">) {
  const res = await axios.post("https://dummyjson.com/products/add", {
    title: car.model,
    brand: car.brand,
    price: car.pricePerDay,
    thumbnail: car.image,
    stock: car.status === "available" ? 10 : 0,
  });
  return res.data;
}

export async function updateCarInAPI(id: string, patch: Partial<Car>) {
  const numId = parseApiId(id);
  if (numId === null) return null;
  const res = await axios.put(`https://dummyjson.com/products/${numId}`, toDummyPayload(patch));
  return res.data;
}

export async function deleteCarFromAPI(id: string) {
  const numId = parseApiId(id);
  if (numId === null) return null;
  const res = await axios.delete(`https://dummyjson.com/products/${numId}`);
  return res.data;
}

export function fallbackCars(): Car[] {
  return seedCars;
}
