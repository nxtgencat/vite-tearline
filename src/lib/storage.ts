// Small wrapper around localStorage with JSON fallback.
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable, ignore silently
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const KEYS = {
  users: 'hbm_users',
  session: 'hbm_session',
  guests: 'hbm_guests',
  bookings: 'hbm_bookings',
  payments: 'hbm_payments',
  roomsOverride: 'hbm_rooms_override',
};
