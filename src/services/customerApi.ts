import axios from "axios";
import { seedCustomers } from "@/lib/seed";
import type { Customer } from "@/lib/types";

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  address: {
    address: string;
    city: string;
    state?: string;
  };
}

export function mapUser(u: DummyUser): Customer {
  return {
    id: `user_${u.id}`,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    mobile: u.phone,
    address: `${u.address.address}, ${u.address.city}`,
    license: `DL-${String(u.id).padStart(4, "0")}-RJ${2018 + (u.id % 7)}`,
    createdAt: new Date(Date.now() - u.id * 86400000).toISOString(),
  };
}

// MANY customers: DummyJSON has 208 users
export async function fetchCustomersFromAPI(limit = 100): Promise<Customer[]> {
  const res = await axios.get<{ users: DummyUser[] }>(
    `https://dummyjson.com/users?limit=${limit}&skip=0&select=id,firstName,lastName,email,phone,username,image,address`
  );
  return res.data.users.map(mapUser);
}

// --- DummyJSON writes (simulated, visible in Network) ---

function parseUserId(id: string): number | null {
  if (!id.startsWith("user_")) return null;
  const n = Number(id.slice(5));
  return Number.isFinite(n) ? n : null;
}

export async function addCustomerToAPI(c: Omit<Customer, "id" | "createdAt">) {
  const [firstName, ...rest] = c.name.split(" ");
  const res = await axios.post("https://dummyjson.com/users/add", {
    firstName: firstName || c.name,
    lastName: rest.join(" ") || "Customer",
    email: c.email,
    phone: c.mobile,
    address: { address: c.address, city: "Pune" },
  });
  return res.data;
}

export async function updateCustomerInAPI(id: string, patch: Partial<Customer>) {
  const numId = parseUserId(id);
  if (numId === null) return null;
  const res = await axios.put(`https://dummyjson.com/users/${numId}`, {
    email: patch.email,
    phone: patch.mobile,
  });
  return res.data;
}

export async function deleteCustomerFromAPI(id: string) {
  const numId = parseUserId(id);
  if (numId === null) return null;
  const res = await axios.delete(`https://dummyjson.com/users/${numId}`);
  return res.data;
}

export function fallbackCustomers(): Customer[] {
  return seedCustomers;
}
