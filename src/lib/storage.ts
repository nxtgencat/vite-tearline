// Small JSON wrapper around localStorage so callers stay simple
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  localStorage.removeItem(key);
}

export const keys = {
  users: "crm_users",
  session: "crm_user",
  carsOverride: "crm_cars_override",
  customers: "crm_customers",
  bookings: "crm_bookings",
};
