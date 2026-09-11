export type CarStatus = "available" | "rented" | "maintenance";
export type BookingStatus = "active" | "completed" | "cancelled";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuelType: FuelType;
  transmission: Transmission;
  seating: number;
  status: CarStatus;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  license: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  totalCost: number;
  status: BookingStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
