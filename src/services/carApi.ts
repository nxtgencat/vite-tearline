import axios from "axios";
import { seedCars } from "@/lib/seed";
import type { Car, FuelType, Transmission } from "@/lib/types";

interface DummyProduct {
  id: number;
  title: string;
  brand?: string;
  price: number;
  thumbnail: string;
  images?: string[];
  stock: number;
  category?: string;
}

const fuels: FuelType[] = ["Petrol", "Diesel", "Electric", "Hybrid"];
const gears: Transmission[] = ["Automatic", "Manual"];
const seatings = [4, 5, 5, 5, 7];

// Deterministic daily rate 49–168 so all 194 products map to sensible rentals
export function priceForProduct(id: number): number {
  return 49 + ((id * 37) % 120);
}

function statusForProduct(id: number, stock: number): Car["status"] {
  if (id % 7 === 0) return "maintenance";
  if (id % 5 === 0) return "rented";
  return stock > 0 ? "available" : "maintenance";
}

function imageForProduct(p: DummyProduct, id: number): string {
  if (p.thumbnail) return p.thumbnail;
  if (p.images && p.images.length > 0) return p.images[0];
  const fallbacks = seedCars.map((c) => c.image);
  return fallbacks[id % fallbacks.length];
}

export function mapProduct(p: DummyProduct): Car {
  const brand =
    p.brand ||
    (p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "DriveLine");
  return {
    id: `api_${p.id}`,
    brand,
    model: p.title,
    year: 2018 + (p.id % 8),
    pricePerDay: priceForProduct(p.id),
    fuelType: fuels[p.id % fuels.length],
    transmission: gears[p.id % gears.length],
    seating: seatings[p.id % seatings.length],
    status: statusForProduct(p.id, p.stock),
    image: imageForProduct(p, p.id),
  };
}

// MANY cars: pull 100 products (DummyJSON has 194 total). Vehicle-only
// category has just 5 items, so we map the full catalog to rentals.
export async function fetchCarsFromAPI(limit = 100): Promise<Car[]> {
  const res = await axios.get<{ products: DummyProduct[] }>(
    `https://dummyjson.com/products?limit=${limit}&skip=0&select=title,brand,price,thumbnail,images,stock,category`
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
