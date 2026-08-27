# MediCare HMS — Enterprise Hospital Management System

Responsive, production-ready HMS built with **React + Vite + Tailwind CSS**, **Context API**, **React Router**, **Axios**, **React Hook Form + Yup**, **React Toastify**, **dayjs**, **React Icons**. Implements 16 enterprise modules with RBAC, mock third-party APIs, and tearline design tokens.

## Summary

- Full auth flow (login/register/forgot/reset) with Yup validation, token storage, protected routes, 30-min auto-logout & session expiry.
- Dashboard with 6 summary cards, revenue chart, recent appointments, activities, quick actions, weather widget.
- CRUD for patients, doctors, appointments, prescriptions, lab reports, billing, pharmacy with search / filter / pagination / sorting / status badges.
- Medical records with diagnosis/treatment/notes/allergies/docs upload.
- Lab reports with status + file preview before download (image & PDF).
- Billing with discount/tax calculation + CSV/Excel/PDF invoice export.
- File upload mocking Cloudinary (preview, progress, remove, type/size validation).
- OpenStreetMap Nominatim search + embed iframe for patient & branch locations.
- EmailJS mock for appointment/billing/lab/prescription notifications.
- 4-role RBAC matrix (Admin, Doctor, Receptionist, Patient) gating menu, page & button visibility.
- Reports with per-module chart + CSV/Excel/PDF export.
- Performance: `React.memo`, `useMemo`, `useCallback`, `lazy` + `Suspense` code splitting, skeleton loaders.
- Error handling for 400/401/404/500/network/timeout via Axios interceptors + ErrorBoundary + retry.

## Tech Stack

- React 19 + Vite 8 + TypeScript 7
- Tailwind CSS 4 + tearline tokens
- React Router DOM 7, Axios, React Hook Form, @hookform/resolvers, yup, react-toastify, dayjs, react-icons
- Context API (no Redux), pnpm only

## File Tree

```
src/
├── assets/                 # static images
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # permission-filtered nav + branches
│   │   ├── Topbar.tsx          # user, role switcher, notifications, logout
│   │   └── PageHeader.tsx      # title + subtitle + action slot
│   └── ui/                     # presentation-only, no fetch
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Table.tsx           # memo rows, column renderers
│       ├── Pagination.tsx
│       ├── SearchBar.tsx
│       ├── FilterPanel.tsx
│       ├── Loader.tsx
│       ├── Skeleton.tsx        # shimmer + TableSkeleton
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       └── FileUpload.tsx      # image/PDF preview, progress, validation
├── constants/
│   ├── roles.ts                # Role, Permission, ROLE_PERMISSIONS, labels
│   └── navigation.ts           # NAV_ITEMS + BRANCHES with permission gates
├── context/
│   ├── AuthContext.tsx         # login/register/logout, token, 30m session
│   └── NotificationContext.tsx # add / markRead / filter
├── hooks/                      # business layer, no JSX
│   ├── useAuth.ts
│   ├── usePermission.ts        # can() + isRole()
│   ├── useDebounce.ts
│   ├── usePatients.ts          # CRUD + usePatientFilter (useMemo)
│   ├── useDoctors.ts
│   └── useAppointments.ts
├── layouts/
│   ├── AuthLayout.tsx          # split-screen marketing + form card
│   └── DashboardLayout.tsx     # Sidebar + Topbar + Outlet + footer
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx       # 6 stats, revenue bars, quick actions
│   ├── patients/
│   │   └── PatientList.tsx     # CRUD + OSM + photo upload + detail modal
│   ├── doctors/
│   │   └── DoctorList.tsx      # dept filter + availability + image upload
│   ├── appointments/
│   │   └── AppointmentList.tsx # book / cancel / reschedule / status tabs
│   ├── records/
│   │   └── MedicalRecords.tsx
│   ├── prescriptions/
│   │   └── PrescriptionList.tsx # meds editor + PDF export
│   ├── lab/
│   │   └── LabReports.tsx      # status + upload + preview
│   ├── billing/
│   │   └── BillingList.tsx     # calcs + CSV/Excel/PDF
│   ├── pharmacy/
│   │   └── PharmacyList.tsx    # stock + low-stock alert
│   ├── notifications/
│   │   └── NotificationCenter.tsx
│   └── reports/
│       └── Reports.tsx         # 6 modules + exports
├── routes/
│   ├── index.tsx               # lazy + Suspense + code splitting
│   ├── ProtectedRoute.tsx      # redirect if no token
│   └── RoleGuard.tsx           # permission gate
├── services/
│   ├── api.ts                  # axios + interceptors + friendly errors
│   ├── storage.ts              # localStorage CRUD helpers
│   ├── mockData.ts             # seedPatients/Doctors/Appointments/etc
│   ├── cloudinary.ts           # validate + mockUpload with progress
│   ├── email.ts                # mock EmailJS send
│   └── osm.ts                  # Nominatim + embedUrl
├── utils/
│   ├── format.ts               # dayjs + currency + timeAgo
│   └── export.ts               # CSV / Excel / PDF (blob)
├── App.tsx                     # BrowserRouter + providers + ErrorBoundary + ToastContainer
├── main.tsx
└── index.css                   # tearline @theme tokens + reusable classes
```

## Purpose of Major Files

- **constants/roles.ts:14** — single source of truth for RBAC; matrix drives `Sidebar`, `RoleGuard`, and button guards via `can()`.
- **services/api.ts:5** — axios instance with timeout, auth header, and friendly mapping for 400/401/404/500/timeout; 401 clears session.
- **services/storage.ts:23** — localStorage array CRUD that makes MockAPI behavior persistent without backend.
- **services/cloudinary.ts:12** — type/size validation (5 MB, jpg/png/webp/pdf) + interval progress + object URL preview; swap for real Cloudinary by editing this file only.
- **services/osm.ts:3** — Nominatim fetch + iframe embed URL; used in patient address search.
- **context/AuthContext.tsx:28** — stores user/token/session timestamp, restores on reload, auto-logout timer, `switchRole` for demo.
- **hooks/usePermission.ts:6** — thin RBAC hook consumed by UI to hide features.
- **components/ui/*:1** — presentational, `React.memo`d, no data fetching; props-only.
- **routes/index.tsx:12** — every page is `lazy` loaded; `Suspense` fallback is `Loader`; chunks are split per page (see build output).

## How to Run (pnpm only)

```bash
# install
pnpm install

# dev (HMR)
pnpm dev
# -> http://localhost:5173

# production build
pnpm build

# preview built site
pnpm preview

# lint
pnpm lint
```

Demo accounts (any password works in mock, but seeded passwords shown for clarity):

- `admin@hospital.com` / `admin123` — Full access
- `doctor@hospital.com` / `doctor123` — Patients view, prescriptions, records
- `reception@hospital.com` / `recep123` — Register patients, bookings, billing
- `patient@hospital.com` / `patient123` — View own data, book appointments

Role switcher in the top bar lets you test the permission matrix without re-login.

## Third-Party API Notes

- **DummyJSON/MockAPI** — mimicked via `services/mockData.ts` + `services/storage.ts` + `services/api.ts` with GET/POST/PUT/PATCH/DELETE, query params, payload shape, status codes, loading & error states.
- **OpenStreetMap** — `services/osm.ts` hits `nominatim.openstreetmap.org/search?format=json&q=` and renders `openstreetmap.org/export/embed.html`.
- **Cloudinary** — `services/cloudinary.ts` mocks upload; replace `mockUpload` with `fetch('https://api.cloudinary.com/v1_1/<cloud>/image/upload')`.
- **EmailJS** — `services/email.ts` logs and toasts; replace with `emailjs.send(serviceId, templateId, data)`.

## Performance & Responsive

- `React.memo` on `Card`, `Table` rows, `Button`, etc.; `useMemo` for filtered/sorted lists; `useCallback` for handlers.
- `lazy` + `Suspense` per route → separate chunks (see `pnpm build` output).
- Tailwind `sm:/md:/lg:` breakpoints; sidebar drawer on mobile, auth split collapses to single column.

