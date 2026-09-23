import { ROOM_IMAGES, fallbackRooms } from '@/lib/seed';
import type { Room, RoomType } from '@/lib/types';

const TYPES: RoomType[] = ['Single', 'Double', 'Deluxe', 'Suite', 'Family'];
const AMENITY_POOL = ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony', 'Kitchen', 'Jacuzzi', 'Safe'];

interface DummyProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
}

function toRoom(p: DummyProduct, index: number): Room {
  const type = TYPES[p.id % TYPES.length];
  const floor = (index % 5) + 1;
  const capacity = type === 'Single' ? 1 : type === 'Double' ? 2 : type === 'Deluxe' ? 3 : type === 'Suite' ? 4 : 5;
  return {
    id: `room_api_${p.id}`,
    number: String(100 + p.id),
    type,
    price: Math.max(49, Math.round(p.price)),
    capacity,
    amenities: AMENITY_POOL.slice(0, 3 + (p.id % 4)),
    floor,
    available: p.id % 4 !== 0,
    image: ROOM_IMAGES[p.id % ROOM_IMAGES.length],
    description: p.description || p.title,
  };
}

// Fetch rooms from DummyJSON and map products to hotel rooms.
export async function fetchRooms(): Promise<{ rooms: Room[]; source: 'api' | 'fallback' }> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=24');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const products = data.products as DummyProduct[];
    if (!Array.isArray(products) || products.length === 0) throw new Error('Empty API');
    return { rooms: products.map(toRoom), source: 'api' };
  } catch {
    return { rooms: fallbackRooms, source: 'fallback' };
  }
}
