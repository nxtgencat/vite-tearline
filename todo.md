# Car Rental Management - Todo

## Open Questions (answered before code)
- Third-Party API choice: DummyJSON (`https://dummyjson.com/products`) mapped to Car shape, with local seed fallback for offline + full CRUD persisted to Local Storage. Reason: reliable, no key, supports search; satisfies Loading & Error handling requirement.
- Assigned module scope: task lists Module 1-9 but says "assigned module" - implementing all 9 as one coherent system since they share Context + routing + layout. No scope added beyond task list.
- Form lib: React Hook Form is Optional - skipped, using controlled inputs + small `lib/validation.ts` to keep deps minimal and beginner-friendly.
- Data persistence: Local Storage for auth user, customers, bookings, car overrides; DummyJSON is read-only for seed so writes go to local layer.
- Branch strategy (local only, no push): `feature/car-rental-management` for all module commits, then local merge to `main`. No `git push` at any step per user note.

## Branch Plan (local only)
1. `git checkout -b feature/car-rental-management` from clean `main`
2. One commit per module: `feat(auth): ...`, `feat(dashboard): ...`, etc.
3. Final: `git checkout main`, `git merge feature/car-rental-management` locally, verify `pnpm build` before merge. No push.

## Phases / Steps
- [ ] Phase 0 Setup: pnpm add react-router-dom axios react-toastify; @ alias in vite.config + tsconfig; tearline tokens in index.css via @theme; fonts in index.html; lib/ structure
- [ ] Phase 1 Module 1 Auth: contexts/AuthContext, pages Login/Register/Forgot, components ProtectedRoute, lib/storage + validation, localStorage session
- [ ] Phase 2 Module 2 Dashboard: pages/Dashboard, hooks/useDashboardStats, stat cards + recent bookings + quick actions, responsive grid
- [ ] Phase 3 Module 3 Cars: services/carApi (DummyJSON + fallback seed), contexts/CarContext, pages Cars list/detail + CarForm modal, search/filter/sort, delete confirm dialog
- [ ] Phase 4 Module 4 Customers: contexts/CustomerContext, pages/Customers, search + pagination + validation
- [ ] Phase 5 Module 5 Booking: contexts/BookingContext, pages/NewBooking, day/cost calc in lib/rental.ts, prevent double-book, summary + confirm + toast
- [ ] Phase 6 Module 6 History: pages/Bookings history, search/filter status/date, details modal, cancel/complete actions
- [ ] Phase 7 Module 7 Availability: pages/Availability, status badge, update status via CarContext, real-time UI via context
- [ ] Phase 8 Module 8 Reports: pages/Reports, hooks/useReports, revenue/bookings/most-rented/active customers/monthly summary + CSS bar chart (no new chart lib)
- [ ] Phase 9 UI/UX + Final: Layout Sidebar/Topbar/Breadcrumbs, components Button/Card/Badge/Modal/Skeleton/EmptyState/Input/ConfirmDialog, Toastify wiring, responsive check, pnpm build, README.md, local commits + local merge

## Files to Create / Modify
- Modify: `vite.config.ts` (add @ alias), `tsconfig.app.json` (paths @/*), `src/index.css` (tearline tokens + .btn/.field/.card), `index.html` (title + fonts), `src/main.tsx` (providers + router), `src/App.tsx` (routes only)
- Create lib: `src/lib/types.ts`, `src/lib/storage.ts`, `src/lib/validation.ts`, `src/lib/rental.ts`, `src/lib/format.ts`, `src/lib/seed.ts`
- Create services: `src/services/carApi.ts`
- Create contexts: `src/contexts/AuthContext.tsx`, `src/contexts/CarContext.tsx`, `src/contexts/CustomerContext.tsx`, `src/contexts/BookingContext.tsx`
- Create hooks: `src/hooks/useDashboardStats.ts`, `src/hooks/useReports.ts`
- Create components: `src/components/layout/AppLayout.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`, `src/components/layout/Breadcrumbs.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/StatusBadge.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/Skeleton.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/Field.tsx`, `src/components/ProtectedRoute.tsx`
- Create pages: `src/pages/auth/LoginPage.tsx`, `src/pages/auth/RegisterPage.tsx`, `src/pages/auth/ForgotPage.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/cars/CarsPage.tsx`, `src/pages/cars/CarDetailPage.tsx`, `src/pages/CustomersPage.tsx`, `src/pages/bookings/NewBookingPage.tsx`, `src/pages/bookings/BookingsPage.tsx`, `src/pages/AvailabilityPage.tsx`, `src/pages/ReportsPage.tsx`
- Docs: `todo.md` (this file), `README.md` (final summary + tree + run)

## Wiring / Data Flow
- main.tsx: BrowserRouter + AuthProvider + CarProvider + CustomerProvider + BookingProvider + ToastContainer -> App.tsx Routes
- AuthContext (localStorage `crm_user`, `crm_users`): login/register/logout -> ProtectedRoute gates `/` app layout -> AppLayout Sidebar + Topbar + Breadcrumbs + Outlet
- CarContext: on mount carApi.fetchCars (DummyJSON) + merge local overrides (`crm_cars_override`) -> exposes cars, loading, error, add/update/remove/setStatus, filters done in lib + page local state
- CustomerContext + BookingContext: localStorage persisted (`crm_customers`, `crm_bookings`); BookingContext depends on CarContext to block already-rented cars and to flip car status to rented on confirm, available on cancel/complete
- Dashboard/useDashboardStats + Reports/useReports: derive totals from Car/Customer/Booking contexts, no JSX in hooks; pages render Card + StatusBadge + tables; all toasts via react-toastify in business layer callers
