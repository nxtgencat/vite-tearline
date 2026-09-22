# Hotel Booking Management System - Plan

## Open Questions - Answers
- Third-party API choice: DummyJSON (`https://dummyjson.com/products`) mapped to rooms, with local fallback seed when offline. Used wherever applicable for room list simulation.
- Auth strategy: static local auth only, users stored in Local Storage key `hbm_users`, session in `hbm_session`. No backend.
- State strategy: Context API only - `AuthContext` for session, `HotelContext` for rooms/guests/bookings/payments. No Redux or extra libs.
- Form + toast libs: `react-hook-form` for validation, `react-toastify` for notifications, `react-router-dom` for routing. Fetch API used directly (no axios needed since fetch covers requirement).
- Charts: dummy CSS bar/donut charts only, no chart library added (keeps bundle simple per YAGNI rule).
- Design source: `design/tearline/index.html` tokens only - paper/surface/ink/slate/line/cobalt/amber/mint/rose, Space Grotesk + Inter + IBM Plex Mono.

## Phases
1. Setup - pnpm add router+form+toast, @ alias, tearline theme in index.css, lib/types/storage/seed/api, contexts, hooks, shared UI components, Layout, App routes.
2. Module 1 Auth - Login/Register/Forgot UI, show-hide password, validation, ProtectedRoute, logout, local storage.
3. Module 2 Dashboard - stat cards, revenue summary, recent bookings, quick actions.
4. Module 3 Rooms - DummyJSON list, add/edit/delete, search/filter/sort/pagination, details page, loading/error.
5. Module 4 Guests - CRUD, search/pagination/validation, profile view.
6. Module 5 Booking - guest+room select, dates, auto nights/total, summary, confirm, double-booking guard, status.
7. Module 6 Stay - check-in/out actions, room availability sync, status update, histories, stay duration.
8. Module 7 Payments - summary, invoice UI modal, status, history, filter/search, dummy download.
9. Module 8 History - history list, details, search/date/status filter, cancel/complete.
10. Module 9 Reports - revenue, monthly bookings, occupancy, most booked type, active guests, trends, dummy charts, stats.
11. Final - verify build, write README.md.

## Files To Create/Modify
- Modified: package.json, vite.config.ts, tsconfig.app.json, src/index.css, src/main.tsx, src/App.tsx, index.html title
- Created lib: src/lib/types.ts, src/lib/storage.ts, src/lib/seed.ts, src/lib/api.ts, src/lib/format.ts
- Created context: src/context/AuthContext.tsx, src/context/HotelContext.tsx
- Created hooks: src/hooks/usePagination.ts, src/hooks/useDashboard.ts, src/hooks/useReports.ts
- Created components: Layout.tsx, ProtectedRoute.tsx, StatCard.tsx, PageHeader.tsx, Badge.tsx, Spinner.tsx, Skeleton.tsx, EmptyState.tsx, Modal.tsx, Pagination.tsx, SearchInput.tsx, RoomCard.tsx
- Created pages auth: pages/auth/Login.tsx, pages/auth/Register.tsx, pages/auth/ForgotPassword.tsx
- Created pages: pages/Dashboard.tsx, pages/rooms/RoomList.tsx, pages/rooms/RoomDetails.tsx, pages/guests/GuestList.tsx, pages/guests/GuestProfile.tsx, pages/bookings/NewBooking.tsx, pages/bookings/BookingHistory.tsx, pages/bookings/BookingDetails.tsx, pages/stay/CheckInOut.tsx, pages/Payments.tsx, pages/Reports.tsx
- Docs: todo.md (this file), README.md (at end)

## Data Flow / Component Flow
- main.tsx wraps App with BrowserRouter + AuthProvider + HotelProvider + ToastContainer.
- App.tsx defines public routes (/login, /register, /forgot) and ProtectedRoute layout (/) with nested pages.
- AuthContext reads/writes local storage users + session, exposes login/register/logout.
- HotelContext on mount fetches rooms from DummyJSON via lib/api, merges with local overrides, loads guests/bookings/payments from storage or seed, persists every change, exposes CRUD + booking Vijaya + checkin/out + payment helpers.
- Pages never fetch directly - they call context + lib/format helpers for nights/totals/dates. Components folder stays presentational - props only, no fetch or business math.
- Toasts fired from pages after context actions succeed or fail.
