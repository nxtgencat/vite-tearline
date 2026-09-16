# DriveLine - Car Rental Management System

Short summary: full rental OS built with React + Vite + Tailwind v4 + Context API + React Router + Axios + React Toastify. Static auth with Local Storage sessions, DummyJSON-backed fleet with local persistence, customers, bookings with double-book guard, history, live availability board, and reports with CSS charts. Tearline design tokens (paper/ink/cobalt, Space Grotesk + Inter + Plex Mono, .btn/.field/.card) throughout. Fully responsive with sidebar, breadcrumbs, skeletons, empty states, modals and toasts.

## File structure

```
src/
  App.tsx
  main.tsx
  index.css
  lib/
    types.ts
    storage.ts
    validation.ts
    rental.ts
    format.ts
    seed.ts
  services/
    carApi.ts
  contexts/
    AuthContext.tsx
    CarContext.tsx
    CustomerContext.tsx
    BookingContext.tsx
  hooks/
    useDashboardStats.ts
    useReports.ts
  components/
    ProtectedRoute.tsx
    layout/
      AppLayout.tsx
      Sidebar.tsx
      Topbar.tsx
      Breadcrumbs.tsx
    ui/
      Card.tsx
      StatusBadge.tsx
      Modal.tsx
      ConfirmDialog.tsx
      Skeleton.tsx
      EmptyState.tsx
      Field.tsx
    cars/
      CarForm.tsx
    customers/
      CustomerForm.tsx
  pages/
    auth/
      LoginPage.tsx
      RegisterPage.tsx
      ForgotPage.tsx
    DashboardPage.tsx
    cars/
      CarsPage.tsx
      CarDetailPage.tsx
    CustomersPage.tsx
    bookings/
      NewBookingPage.tsx
      BookingsPage.tsx
    AvailabilityPage.tsx
    ReportsPage.tsx
```

## What each part does

- `App.tsx`: route table only, auth pages public, everything else behind ProtectedRoute + AppLayout
- `main.tsx`: BrowserRouter + all four providers + ToastContainer wiring
- `index.css`: tearline tokens via Tailwind v4 @theme plus .btn-primary/.btn-secondary/.btn-outline/.btn-ghost/.btn-icon/.field/.card/.ticket-tag/.skeleton
- `lib/types.ts`: Car, Customer, Booking, User shared shapes
- `lib/storage.ts`: JSON localStorage helpers + key names
- `lib/validation.ts`: login, register, customer and car validators
- `lib/rental.ts`: day count, total cost, overlap check, uid
- `lib/format.ts`: currency, date, today helpers
- `lib/seed.ts`: offline fallback fleet + demo customers
- `services/carApi.ts`: DummyJSON fetch + map to Car, fallback export
- `contexts/*`: business layer only, no JSX except providers, persisted to Local Storage
- `hooks/*`: derived stats for dashboard and reports, no JSX
- `components/layout/*`: sidebar nav, topbar with logout, breadcrumbs, outlet shell
- `components/ui/*`: presentation-only primitives reused everywhere
- `components/cars/CarForm.tsx`, `components/customers/CustomerForm.tsx`: controlled forms with validation display
- `pages/*`: thin pages that read contexts/hooks and render UI components

## How to run (pnpm only)

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm lint`
