# Harbor Stay - Hotel Booking Management System

React + Vite + Tailwind CSS hotel admin app with Context API, React Router, React Hook Form, Toastify, Local Storage, and DummyJSON API integration.

## Summary
- Static staff auth with protected routes and local storage sessions.
- Dashboard with occupancy, arrivals, revenue summary, recent bookings, quick actions.
- Rooms from DummyJSON mapped to hotel rooms with CRUD, search, type/status filter, price sort, pagination, details page, loading and error states.
- Guests CRUD with validation, search, pagination, profile view with stay list.
- Booking flow with guest and room pickers, auto nights and total, summary, confirmation, double-booking guard.
- Check-in/out board with room availability sync, status updates, histories, stay duration.
- Payments with summary cards, invoice modal UI, status badges, history, search and status filter, dummy download.
- Booking history with details page, search, date and status filters, cancel and complete actions.
- Reports with total revenue, monthly counts, occupancy rate, most booked type, active guests, live trends plus dummy revenue chart.

## File Structure
```
src/
  main.tsx
  App.tsx
  index.css
  lib/
    types.ts
    storage.ts
    seed.ts
    api.ts
    format.ts
  context/
    AuthContext.tsx
    HotelContext.tsx
  hooks/
    usePagination.ts
    useDashboard.ts
    useReports.ts
  components/
    Layout.tsx
    ProtectedRoute.tsx
    StatCard.tsx
    PageHeader.tsx
    Badge.tsx
    Spinner.tsx
    Skeleton.tsx
    EmptyState.tsx
    Modal.tsx
    Pagination.tsx
    SearchInput.tsx
    RoomCard.tsx
  pages/
    auth/Login.tsx
    auth/Register.tsx
    auth/ForgotPassword.tsx
    Dashboard.tsx
    rooms/RoomList.tsx
    rooms/RoomDetails.tsx
    guests/GuestList.tsx
    guests/GuestProfile.tsx
    bookings/NewBooking.tsx
    bookings/BookingHistory.tsx
    bookings/BookingDetails.tsx
    stay/CheckInOut.tsx
    Payments.tsx
    Reports.tsx
```

## Purpose Of Major Files
- `lib/types.ts` - shared Room, Guest, Booking, Payment, AuthUser shapes.
- `lib/storage.ts` - localStorage load/save helpers plus key names and id generator.
- `lib/seed.ts` - fallback rooms, demo guests, bookings, payments, dummy chart data.
- `lib/api.ts` - DummyJSON fetch mapped to rooms with offline fallback.
- `lib/format.ts` - currency, nights, dates, overlap checks, no JSX.
- `context/AuthContext.tsx` - register, login, logout, session persistence.
- `context/HotelContext.tsx` - rooms, guests, bookings, payments store with CRUD and stay transitions.
- `hooks/usePagination.ts` - generic client pagination.
- `hooks/useDashboard.ts` - dashboard stat calculations.
- `hooks/useReports.ts` - revenue, occupancy, trends aggregation.
- `components/Layout.tsx` - sidebar plus mobile nav shell.
- `components/*` - presentational UI only, no fetching or math.
- `pages/*` - one screen per module, calls context and lib helpers.

## How To Run
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Preview build: `pnpm preview`
- Lint: `pnpm lint`

## Commit History
- One commit per module, from setup through Module 9, all on this branch.
- Run `git log --oneline` to review each module delivery.
