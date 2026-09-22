import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import RoomList from '@/pages/rooms/RoomList';
import RoomDetails from '@/pages/rooms/RoomDetails';
import GuestList from '@/pages/guests/GuestList';
import GuestProfile from '@/pages/guests/GuestProfile';
import NewBooking from '@/pages/bookings/NewBooking';
import BookingHistory from '@/pages/bookings/BookingHistory';
import BookingDetails from '@/pages/bookings/BookingDetails';
import CheckInOut from '@/pages/stay/CheckInOut';
import Payments from '@/pages/Payments';
import Reports from '@/pages/Reports';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="rooms" element={<RoomList />} />
        <Route path="rooms/:id" element={<RoomDetails />} />
        <Route path="guests" element={<GuestList />} />
        <Route path="guests/:id" element={<GuestProfile />} />
        <Route path="book" element={<NewBooking />} />
        <Route path="stay" element={<CheckInOut />} />
        <Route path="payments" element={<Payments />} />
        <Route path="history" element={<BookingHistory />} />
        <Route path="history/:id" element={<BookingDetails />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
