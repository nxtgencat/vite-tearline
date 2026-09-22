export type RoomType = 'Single' | 'Double' | 'Deluxe' | 'Suite' | 'Family';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  capacity: number;
  amenities: string[];
  floor: number;
  available: boolean;
  image: string;
  description: string;
}

export interface Guest {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  idProof: string;
  nationality: string;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  guestId: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  date: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}
