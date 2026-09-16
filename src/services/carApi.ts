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

// The only real vehicles DummyJSON has: 5 cars + 5 bikes (verified live)
export const LIVE_VEHICLE_IDS = [167, 168, 169, 170, 171, 113, 114, 115, 116, 117];

// Deterministic daily rate for live DummyJSON vehicles
export function priceForProduct(id: number): number {
  return 49 + ((id * 37) % 120);
}

function statusForProduct(id: number, stock: number): Car["status"] {
  if (id % 7 === 0) return "maintenance";
  if (id % 5 === 0) return "rented";
  return stock > 0 ? "available" : "maintenance";
}

export function mapProduct(p: DummyProduct): Car {
  return {
    id: `api_${p.id}`,
    brand: p.brand || "DriveLine",
    model: p.title,
    year: 2018 + (p.id % 8),
    pricePerDay: priceForProduct(p.id),
    fuelType: fuels[p.id % fuels.length],
    transmission: gears[p.id % gears.length],
    seating: seatings[p.id % seatings.length],
    status: statusForProduct(p.id, p.stock),
    image: p.thumbnail || p.images?.[0] || seedCars[p.id % seedCars.length].image,
  };
}

// Fleet = 10 LIVE DummyJSON vehicles + 60 curated rental cars.
// Only vehicle/motorcycle categories are fetched — never cosmetics.
export async function fetchCarsFromAPI(): Promise<Car[]> {
  const sel = "select=title,brand,price,thumbnail,images,stock";
  const [vehicles, bikes] = await Promise.all([
    axios.get<{ products: DummyProduct[] }>(
      `https://dummyjson.com/products/category/vehicle?${sel}`
    ),
    axios.get<{ products: DummyProduct[] }>(
      `https://dummyjson.com/products/category/motorcycle?${sel}`
    ),
  ]);
  const live = [...vehicles.data.products, ...bikes.data.products].map(mapProduct);
  return [...live, ...buildFleetCars()];
}

// --- Relevant local fleet (60 real rental cars) ---
// DummyJSON's full catalog is cosmetics/electronics — wrong for a car
// rental app — so the bulk fleet is curated here while every CRUD
// still hits DummyJSON (visible in Network).

interface FleetSpec {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuelType: FuelType;
  transmission: Transmission;
  seating: number;
}

const FLEET: FleetSpec[] = [
  { brand: "Tesla", model: "Model 3", year: 2023, pricePerDay: 89, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "BMW", model: "3 Series", year: 2022, pricePerDay: 95, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Audi", model: "A4", year: 2022, pricePerDay: 92, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Toyota", model: "Camry", year: 2021, pricePerDay: 55, fuelType: "Hybrid", transmission: "Automatic", seating: 5 },
  { brand: "Honda", model: "Civic", year: 2021, pricePerDay: 48, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Ford", model: "Mustang", year: 2023, pricePerDay: 120, fuelType: "Petrol", transmission: "Manual", seating: 4 },
  { brand: "Mercedes", model: "C-Class", year: 2022, pricePerDay: 110, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Hyundai", model: "Creta", year: 2020, pricePerDay: 42, fuelType: "Diesel", transmission: "Manual", seating: 5 },
  { brand: "Kia", model: "Seltos", year: 2021, pricePerDay: 45, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Maruti", model: "Swift", year: 2020, pricePerDay: 32, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Tata", model: "Nexon EV", year: 2023, pricePerDay: 58, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "Mahindra", model: "Thar", year: 2022, pricePerDay: 75, fuelType: "Diesel", transmission: "Manual", seating: 4 },
  { brand: "Toyota", model: "Innova Crysta", year: 2022, pricePerDay: 68, fuelType: "Diesel", transmission: "Manual", seating: 7 },
  { brand: "Honda", model: "City", year: 2021, pricePerDay: 44, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Hyundai", model: "Verna", year: 2022, pricePerDay: 46, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Maruti", model: "Baleno", year: 2021, pricePerDay: 36, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Tata", model: "Harrier", year: 2022, pricePerDay: 62, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Mahindra", model: "XUV700", year: 2023, pricePerDay: 72, fuelType: "Diesel", transmission: "Automatic", seating: 7 },
  { brand: "Kia", model: "Sonet", year: 2021, pricePerDay: 43, fuelType: "Diesel", transmission: "Manual", seating: 5 },
  { brand: "Hyundai", model: "i20", year: 2020, pricePerDay: 35, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Toyota", model: "Fortuner", year: 2022, pricePerDay: 95, fuelType: "Diesel", transmission: "Automatic", seating: 7 },
  { brand: "Ford", model: "EcoSport", year: 2020, pricePerDay: 40, fuelType: "Diesel", transmission: "Manual", seating: 5 },
  { brand: "Honda", model: "Amaze", year: 2020, pricePerDay: 38, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Maruti", model: "Ertiga", year: 2021, pricePerDay: 50, fuelType: "Petrol", transmission: "Manual", seating: 7 },
  { brand: "Tata", model: "Safari", year: 2023, pricePerDay: 70, fuelType: "Diesel", transmission: "Automatic", seating: 7 },
  { brand: "Mahindra", model: "Scorpio-N", year: 2023, pricePerDay: 74, fuelType: "Diesel", transmission: "Manual", seating: 7 },
  { brand: "BMW", model: "X1", year: 2022, pricePerDay: 105, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Audi", model: "Q3", year: 2022, pricePerDay: 108, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Mercedes", model: "GLA", year: 2021, pricePerDay: 102, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Volkswagen", model: "Taigun", year: 2022, pricePerDay: 47, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Skoda", model: "Slavia", year: 2022, pricePerDay: 45, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "MG", model: "Hector", year: 2021, pricePerDay: 58, fuelType: "Diesel", transmission: "Manual", seating: 5 },
  { brand: "Jeep", model: "Compass", year: 2021, pricePerDay: 65, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Renault", model: "Kwid", year: 2020, pricePerDay: 28, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Nissan", model: "Magnite", year: 2021, pricePerDay: 37, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Toyota", model: "Glanza", year: 2021, pricePerDay: 34, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Honda", model: "WR-V", year: 2020, pricePerDay: 39, fuelType: "Diesel", transmission: "Manual", seating: 5 },
  { brand: "Hyundai", model: "Venue", year: 2021, pricePerDay: 41, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Kia", model: "Carens", year: 2022, pricePerDay: 55, fuelType: "Diesel", transmission: "Automatic", seating: 7 },
  { brand: "Tata", model: "Punch", year: 2022, pricePerDay: 36, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Maruti", model: "Brezza", year: 2022, pricePerDay: 44, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Mahindra", model: "Bolero", year: 2020, pricePerDay: 42, fuelType: "Diesel", transmission: "Manual", seating: 7 },
  { brand: "Force", model: "Gurkha", year: 2022, pricePerDay: 66, fuelType: "Diesel", transmission: "Manual", seating: 4 },
  { brand: "BMW", model: "5 Series", year: 2023, pricePerDay: 135, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Audi", model: "A6", year: 2023, pricePerDay: 132, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Mercedes", model: "E-Class", year: 2023, pricePerDay: 140, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Jaguar", model: "XF", year: 2021, pricePerDay: 125, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Land Rover", model: "Defender", year: 2023, pricePerDay: 150, fuelType: "Diesel", transmission: "Automatic", seating: 5 },
  { brand: "Volvo", model: "XC60", year: 2022, pricePerDay: 115, fuelType: "Hybrid", transmission: "Automatic", seating: 5 },
  { brand: "Mini", model: "Cooper", year: 2021, pricePerDay: 85, fuelType: "Petrol", transmission: "Automatic", seating: 4 },
  { brand: "Suzuki", model: "Jimny", year: 2023, pricePerDay: 60, fuelType: "Petrol", transmission: "Manual", seating: 4 },
  { brand: "Lexus", model: "ES", year: 2022, pricePerDay: 118, fuelType: "Hybrid", transmission: "Automatic", seating: 5 },
  { brand: "Toyota", model: "Vellfire", year: 2023, pricePerDay: 145, fuelType: "Hybrid", transmission: "Automatic", seating: 7 },
  { brand: "Kia", model: "EV6", year: 2023, pricePerDay: 98, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "Hyundai", model: "Ioniq 5", year: 2023, pricePerDay: 96, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "Tata", model: "Curvv EV", year: 2024, pricePerDay: 64, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "Mahindra", model: "BE.06", year: 2024, pricePerDay: 78, fuelType: "Electric", transmission: "Automatic", seating: 5 },
  { brand: "Maruti", model: "Fronx", year: 2023, pricePerDay: 40, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
  { brand: "Honda", model: "Elevate", year: 2023, pricePerDay: 52, fuelType: "Petrol", transmission: "Manual", seating: 5 },
  { brand: "Skoda", model: "Kushaq", year: 2022, pricePerDay: 48, fuelType: "Petrol", transmission: "Automatic", seating: 5 },
];

export const FLEET_SIZE = FLEET.length;

function fleetStatus(n: number): Car["status"] {
  if (n % 11 === 0) return "maintenance";
  if (n % 6 === 0) return "rented";
  return "available";
}

export function buildFleetCars(): Car[] {
  const imgs = seedCars.map((c) => c.image);
  return FLEET.map((s, i) => {
    const n = i + 1;
    return {
      id: `fleet_${n}`,
      brand: s.brand,
      model: s.model,
      year: s.year,
      pricePerDay: s.pricePerDay,
      fuelType: s.fuelType,
      transmission: s.transmission,
      seating: s.seating,
      status: fleetStatus(n),
      image: imgs[i % imgs.length],
    };
  });
}

// Daily rate lookup for any fleet/live car id (used by bookings)
export function priceForCarId(carId: string): number {
  if (carId.startsWith("fleet_")) {
    const n = Number(carId.slice(6));
    if (Number.isFinite(n) && n >= 1 && n <= FLEET.length) return FLEET[n - 1].pricePerDay;
  }
  if (carId.startsWith("api_")) {
    const n = Number(carId.slice(4));
    if (Number.isFinite(n)) return priceForProduct(n);
  }
  return 55;
}

// Deterministic booking car: spreads rentals across live + fleet cars
export function bookingCarId(idx: number): string {
  if (idx % 7 === 0) return `api_${LIVE_VEHICLE_IDS[idx % LIVE_VEHICLE_IDS.length]}`;
  return `fleet_${(idx % FLEET_SIZE) + 1}`;
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
  return [...seedCars, ...buildFleetCars()];
}
