import type { Booking, Guest, Payment, Room } from '@/lib/types';

// Local fallback rooms used when DummyJSON is unreachable.
export const fallbackRooms: Room[] = [
  {
    id: 'room_101',
    number: '101',
    type: 'Single',
    price: 89,
    capacity: 1,
    amenities: ['WiFi', 'TV', 'AC'],
    floor: 1,
    available: true,
    image: 'https://picsum.photos/seed/hotel101/600/400',
    description: 'Cozy single room with city view.',
  },
  {
    id: 'room_102',
    number: '102',
    type: 'Double',
    price: 129,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    floor: 1,
    available: true,
    image: 'https://picsum.photos/seed/hotel102/600/400',
    description: 'Comfortable double room for two guests.',
  },
  {
    id: 'room_201',
    number: '201',
    type: 'Deluxe',
    price: 199,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
    floor: 2,
    available: false,
    image: 'https://picsum.photos/seed/hotel201/600/400',
    description: 'Spacious deluxe room with balcony.',
  },
  {
    id: 'room_202',
    number: '202',
    type: 'Suite',
    price: 349,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Lounge'],
    floor: 2,
    available: true,
    image: 'https://picsum.photos/seed/hotel202/600/400',
    description: 'Luxury suite with lounge and jacuzzi.',
  },
  {
    id: 'room_301',
    number: '301',
    type: 'Family',
    price: 249,
    capacity: 5,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchen', 'Sofa Bed'],
    floor: 3,
    available: true,
    image: 'https://picsum.photos/seed/hotel301/600/400',
    description: 'Large family room with kitchen corner.',
  },
  {
    id: 'room_302',
    number: '302',
    type: 'Deluxe',
    price: 219,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Balcony'],
    floor: 3,
    available: true,
    image: 'https://picsum.photos/seed/hotel302/600/400',
    description: 'Deluxe triple room with garden view.',
  },
];

export const seedGuests: Guest[] = [
  {
    id: 'guest_1',
    fullName: 'Aarav Sharma',
    email: 'aarav@example.com',
    mobile: '9876543210',
    address: '12 MG Road, Bengaluru',
    idProof: 'ID- A1234567',
    nationality: 'Indian',
    createdAt: '2026-08-02T10:00:00.000Z',
  },
  {
    id: 'guest_2',
    fullName: 'Sophia Carter',
    email: 'sophia@example.com',
    mobile: '9822001122',
    address: '44 Park Street, Mumbai',
    idProof: 'US- P9876543',
    nationality: 'American',
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'guest_3',
    fullName: 'Rahul Verma',
    email: 'rahul@example.com',
    mobile: '9911223344',
    address: '7 Lake View, Delhi',
    idProof: 'ID- B7654321',
    nationality: 'Indian',
    createdAt: '2026-09-01T10:00:00.000Z',
  },
];

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function seedBookings(): Booking[] {
  const today = todayISO();
  return [
    {
      id: 'book_1',
      guestId: 'guest_1',
      roomId: 'room_201',
      checkIn: today,
      checkOut: todayPlus(2),
      nights: 2,
      total: 398,
      status: 'checked-in',
      createdAt: '2026-09-10T09:00:00.000Z',
    },
    {
      id: 'book_2',
      guestId: 'guest_2',
      roomId: 'room_102',
      checkIn: today,
      checkOut: todayPlus(1),
      nights: 1,
      total: 129,
      status: 'confirmed',
      createdAt: '2026-09-18T09:00:00.000Z',
    },
    {
      id: 'book_3',
      guestId: 'guest_3',
      roomId: 'room_202',
      checkIn: todayPlus(-4),
      checkOut: today,
      nights: 4,
      total: 1396,
      status: 'checked-out',
      createdAt: '2026-09-05T09:00:00.000Z',
    },
  ];
}

export function seedPayments(bookings: Booking[]): Payment[] {
  return bookings.map((b, i) => ({
    id: `pay_${i + 1}`,
    bookingId: b.id,
    guestId: b.guestId,
    amount: b.total,
    status: b.status === 'cancelled' ? 'refunded' : b.status === 'confirmed' ? 'pending' : 'paid',
    method: i % 2 === 0 ? 'Card' : 'UPI',
    date: b.createdAt.slice(0, 10),
  }));
}

export const monthlyRevenue = [4200, 5100, 4800, 6200, 7100, 6800, 8200, 7600, 5900];
export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
