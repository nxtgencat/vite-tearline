import type { Car } from "./types";

// Local fallback seed used when DummyJSON is unreachable
// Images are stable Unsplash car photos
export const seedCars: Car[] = [
  { id: "seed_1", brand: "Tesla", model: "Model 3", year: 2023, pricePerDay: 89, fuelType: "Electric", transmission: "Automatic", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" },
  { id: "seed_2", brand: "BMW", model: "3 Series", year: 2022, pricePerDay: 95, fuelType: "Petrol", transmission: "Automatic", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80" },
  { id: "seed_3", brand: "Audi", model: "A4", year: 2022, pricePerDay: 92, fuelType: "Diesel", transmission: "Automatic", seating: 5, status: "rented", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80" },
  { id: "seed_4", brand: "Toyota", model: "Camry", year: 2021, pricePerDay: 55, fuelType: "Hybrid", transmission: "Automatic", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80" },
  { id: "seed_5", brand: "Honda", model: "Civic", year: 2021, pricePerDay: 48, fuelType: "Petrol", transmission: "Manual", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80" },
  { id: "seed_6", brand: "Ford", model: "Mustang", year: 2023, pricePerDay: 120, fuelType: "Petrol", transmission: "Manual", seating: 4, status: "available", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80" },
  { id: "seed_7", brand: "Mercedes", model: "C-Class", year: 2022, pricePerDay: 110, fuelType: "Diesel", transmission: "Automatic", seating: 5, status: "maintenance", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80" },
  { id: "seed_8", brand: "Hyundai", model: "Creta", year: 2020, pricePerDay: 42, fuelType: "Diesel", transmission: "Manual", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80" },
  { id: "seed_9", brand: "Kia", model: "Seltos", year: 2021, pricePerDay: 45, fuelType: "Petrol", transmission: "Automatic", seating: 5, status: "rented", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80" },
  { id: "seed_10", brand: "Maruti", model: "Swift", year: 2020, pricePerDay: 32, fuelType: "Petrol", transmission: "Manual", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80" },
  { id: "seed_11", brand: "Tata", model: "Nexon EV", year: 2023, pricePerDay: 58, fuelType: "Electric", transmission: "Automatic", seating: 5, status: "available", image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&q=80" },
  { id: "seed_12", brand: "Mahindra", model: "Thar", year: 2022, pricePerDay: 75, fuelType: "Diesel", transmission: "Manual", seating: 4, status: "maintenance", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80" },
];

export const seedCustomers = [
  { id: "cust_seed_1", name: "Aarav Sharma", email: "aarav@mail.com", mobile: "9876543210", address: "12 MG Road, Pune", license: "MH12-202100123", createdAt: new Date().toISOString() },
  { id: "cust_seed_2", name: "Diya Patel", email: "diya@mail.com", mobile: "9822001122", address: "45 FC Road, Pune", license: "MH14-201900456", createdAt: new Date().toISOString() },
  { id: "cust_seed_3", name: "Kabir Singh", email: "kabir@mail.com", mobile: "9811002233", address: "8 Park Street, Mumbai", license: "MH02-202000789", createdAt: new Date().toISOString() },
];
