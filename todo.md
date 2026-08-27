# HMS — Enterprise Hospital Management System — TODO

## Open Questions (answered before code)

1. **DummyJSON vs MockAPI endpoint?**
   -> Use local mock service layer (`services/api.ts` + `services/mockData.ts` + `services/storage.ts`) that mimics DummyJSON/MockAPI contract: GET/POST/PUT/PATCH/DELETE, payload/response shape, status codes, query params, pagination, error handling, loading states. Persist to localStorage so CRUD survives reload. Fallback fetch to https://dummyjson.com when online for read-only seed.

2. **OpenStreetMap API key?**
   -> No key. Use Nominatim search `https://nominatim.openstreetmap.org/search?format=json&q=` + embedded OSM iframe `https://www.openstreetmap.org/export/embed.html`. Show hospital branches as markers via query params. No paid API.

3. **Cloudinary credentials?**
   -> Mock `services/cloudinary.ts` with `FileReader` base64 + `URL.createObjectURL` for preview, simulated progress interval, type/size validation. Same UX (preview, PDF preview, progress, remove) without real credentials.

4. **EmailJS credentials?**
   -> Mock `services/email.ts` that resolves after delay and triggers `react-toastify` success. Logs payload to console for verification. Swap to real `emailjs.send` by only changing this service.

5. **Auth backend?**
   -> Client-side validation (React Hook Form + Yup) + mock API auth in AuthContext. Store token in localStorage, attach via Axios interceptor, protected routes, auto logout after 30min, session expiry handling via timer + 401 interceptor.

6. **Role switcher for demo?**
   -> Seed 4 demo users (admin/doctor/receptionist/patient) + role switcher in Topbar so reviewer can test Permission Matrix without re-login.

## Phases & Steps

### Phase 0 — Project Setup
- [x] 0.1 Install deps: react-router-dom, axios, react-hook-form, @hookform/resolvers, yup, react-toastify, dayjs, react-icons
- [x] 0.2 Update `vite.config.ts` with `@` alias + update `tsconfig.json` / `tsconfig.app.json`
- [x] 0.3 Replace `src/index.css` with tearline tokens (paper/surface/ink/slate/line/cobalt/amber/mint/rose + fonts + radius/shadow + reusable classes)
- [x] 0.4 Scaffold folder structure: assets, components/ui, components/layout, context, hooks, layouts, pages/*, routes, services, utils, constants

### Phase 1 — Core Utilities & Services
- [x] 1.1 `constants/roles.ts` — roles, permissions matrix, ROLE_PERMISSIONS, NAV_ITEMS with permission gates
- [x] 1.2 `constants/navigation.ts` — menu config
- [x] 1.3 `utils/format.ts` — dayjs formatters
- [x] 1.4 `utils/export.ts` — csv/pdf/excel export helpers (blob + download)
- [x] 1.5 `services/storage.ts` — localStorage CRUD helpers with error boundaries
- [x] 1.6 `services/mockData.ts` — seed patients/doctors/appointments/prescriptions/pharmacy/billing/lab/notifications
- [x] 1.7 `services/api.ts` — axios instance, interceptors, timeout, error handler (400/401/404/500/network/timeout), mock adapter over storage
- [x] 1.8 `services/cloudinary.ts` — mock upload with progress callback, validation
- [x] 1.9 `services/email.ts` — mock emailjs send
- [x] 1.10 `services/osm.ts` — Nominatim search helper

### Phase 2 — Context & Hooks (Business Layer)
- [x] 2.1 `context/AuthContext.tsx` — user, token, login/register/logout, session timer, restore from storage
- [x] 2.2 `context/NotificationContext.tsx` — notifications CRUD, mark read, filter
- [x] 2.3 `hooks/useAuth.ts` — convenience wrapper
- [x] 2.4 `hooks/usePermission.ts` — can(action, resource), isRole
- [x] 2.5 `hooks/useDebounce.ts`
- [x] 2.6 `hooks/usePatients.ts`, `useDoctors.ts`, `useAppointments.ts` — fetch, search, filter, sort, paginate with useMemo/useCallback

### Phase 3 — Reusable Components (UI layer only, no fetch/business)
- [x] 3.1 `components/ui/Button.tsx` — variants primary/secondary/outline/ghost, memo
- [x] 3.2 `components/ui/Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Badge.tsx`
- [x] 3.3 `components/ui/Card.tsx`, `components/ui/Modal.tsx`, `ConfirmDialog.tsx`
- [x] 3.4 `components/ui/Table.tsx` — head, row memo, empty
- [x] 3.5 `components/ui/Pagination.tsx`
- [x] 3.6 `components/ui/SearchBar.tsx`, `FilterPanel.tsx`
- [x] 3.7 `components/ui/Loader.tsx`, `Skeleton.tsx`, `EmptyState.tsx`
- [x] 3.8 `components/ui/FileUpload.tsx` — image/PDF preview, progress, remove, type/size validation
- [x] 3.9 `components/layout/Sidebar.tsx` — permission-filtered nav, responsive drawer
- [x] 3.10 `components/layout/Topbar.tsx` — user, role switcher, notifications bell, logout
- [x] 3.11 `components/layout/PageHeader.tsx`

### Phase 4 — Layouts & Routes
- [x] 4.1 `layouts/AuthLayout.tsx`, `layouts/DashboardLayout.tsx` — responsive shell
- [x] 4.2 `routes/ProtectedRoute.tsx`, `routes/RoleGuard.tsx`
- [x] 4.3 `routes/index.tsx` — lazy + Suspense + code splitting, error boundary

### Phase 5 — Auth Pages (Module 1)
- [x] 5.1 `pages/auth/Login.tsx` — RHF + Yup, demo credentials helper, toast
- [x] 5.2 `pages/auth/Register.tsx`
- [x] 5.3 `pages/auth/ForgotPassword.tsx`
- [x] 5.4 `pages/auth/ResetPassword.tsx`

### Phase 6 — Dashboard (Module 2)
- [x] 6.1 `pages/dashboard/Dashboard.tsx` — summary cards, revenue chart (css), recent activities, quick actions, weather widget

### Phase 7 — Patient Management (Module 3)
- [x] 7.1 `pages/patients/PatientList.tsx` — CRUD, search, filter, pagination, sorting, status badge, view/edit/delete
- [x] 7.2 `pages/patients/PatientForm.tsx` — RHF + Yup, OSM address, Cloudinary photo (merged into List modal)
- [x] 7.3 `pages/patients/PatientDetail.tsx` — modal drawer (merged into List)

### Phase 8 — Doctor Management (Module 4)
- [x] 8.1 `pages/doctors/DoctorList.tsx` — search, dept filter, availability calendar

### Phase 9 — Appointments (Module 5)
- [x] 9.1 `pages/appointments/AppointmentList.tsx` + `AppointmentBook.tsx` — book, slot picker, cancel/reschedule, upcoming/completed/cancelled tabs, email mock

### Phase 10 — Medical Records (Module 6)
- [x] 10.1 `pages/records/MedicalRecords.tsx` — diagnosis, treatment, notes, allergies, docs upload

### Phase 11 — Prescriptions (Module 7)
- [x] 11.1 `pages/prescriptions/PrescriptionList.tsx` — create/edit/history, PDF export via export util

### Phase 12 — Lab Reports (Module 8)
- [x] 12.1 `pages/lab/LabReports.tsx` — test requests, status, PDF/image upload + preview before download

### Phase 13 — Billing (Module 9)
- [x] 13.1 `pages/billing/BillingList.tsx` — charges, discount/tax calc, invoice generation, PDF/Excel/CSV export

### Phase 14 — Pharmacy (Module 10)
- [x] 14.1 `pages/pharmacy/PharmacyList.tsx` — medicine CRUD, stock, low-stock alerts, categories, supplier

### Phase 15 — Notifications (Module 11)
- [x] 15.1 `pages/notifications/NotificationCenter.tsx` — mark read/delete/filter

### Phase 16 — Reports (Module 13)
- [x] 16.1 `pages/reports/Reports.tsx` — patients/doctors/appointments/billing/pharmacy/lab charts + export PDF/Excel/CSV

### Phase 17 — Polish
- [x] 17.1 Performance: React.memo, useMemo, useCallback, lazy, Suspense, Skeleton
- [x] 17.2 Responsive checks (mobile/tablet/desktop)
- [x] 17.3 Error handling boundary + retry UI
- [x] 17.4 Toast setup in App.tsx
- [x] 17.5 Verify build: `pnpm build`

## Files to Create / Modify

**Modify:**
- vite.config.ts
- tsconfig.json, tsconfig.app.json
- src/index.css
- src/App.tsx
- src/main.tsx
- package.json (via pnpm add, not manual)

**Create:**
- src/constants/roles.ts
- src/constants/navigation.ts
- src/utils/format.ts
- src/utils/export.ts
- src/services/storage.ts
- src/services/mockData.ts
- src/services/api.ts
- src/services/cloudinary.ts
- src/services/email.ts
- src/services/osm.ts
- src/context/AuthContext.tsx
- src/context/NotificationContext.tsx
- src/hooks/useAuth.ts
- src/hooks/usePermission.ts
- src/hooks/useDebounce.ts
- src/hooks/usePatients.ts
- src/hooks/useDoctors.ts
- src/hooks/useAppointments.ts
- src/components/ui/Button.tsx
- src/components/ui/Input.tsx
- src/components/ui/Badge.tsx
- src/components/ui/Card.tsx
- src/components/ui/Modal.tsx
- src/components/ui/Table.tsx
- src/components/ui/Pagination.tsx
- src/components/ui/SearchBar.tsx
- src/components/ui/FilterPanel.tsx
- src/components/ui/Loader.tsx
- src/components/ui/Skeleton.tsx
- src/components/ui/EmptyState.tsx
- src/components/ui/ConfirmDialog.tsx
- src/components/ui/FileUpload.tsx
- src/components/layout/Sidebar.tsx
- src/components/layout/Topbar.tsx
- src/components/layout/PageHeader.tsx
- src/layouts/AuthLayout.tsx
- src/layouts/DashboardLayout.tsx
- src/routes/index.tsx
- src/routes/ProtectedRoute.tsx
- src/routes/RoleGuard.tsx
- src/pages/auth/Login.tsx
- src/pages/auth/Register.tsx
- src/pages/auth/ForgotPassword.tsx
- src/pages/auth/ResetPassword.tsx
- src/pages/dashboard/Dashboard.tsx
- src/pages/patients/PatientList.tsx
- src/pages/doctors/DoctorList.tsx
- src/pages/appointments/AppointmentList.tsx
- src/pages/records/MedicalRecords.tsx
- src/pages/prescriptions/PrescriptionList.tsx
- src/pages/lab/LabReports.tsx
- src/pages/billing/BillingList.tsx
- src/pages/pharmacy/PharmacyList.tsx
- src/pages/notifications/NotificationCenter.tsx
- src/pages/reports/Reports.tsx

## Wiring / Data Flow

```
main.tsx -> App.tsx -> BrowserRouter -> routes/index.tsx (lazy pages in Suspense)
AuthContext (token/user/session) -> ProtectedRoute -> DashboardLayout (Sidebar+Topbar)
Page -> hook (usePatients etc) -> services/api.ts -> services/storage.ts (localStorage) + mockData seed
        -> reusable UI components (Table, Pagination, etc) receive props only, no fetch
RBAC: constants/roles.ts matrix -> hooks/usePermission.ts -> RoleGuard + filtered Sidebar + hidden buttons
Upload: FileUpload -> services/cloudinary.ts (progress cb) -> preview state
Map: OSM search input -> services/osm.ts (Nominatim) -> iframe embed
Email: action (book/cancel/bill) -> services/email.ts -> toast
Export: Reports/Billing -> utils/export.ts -> Blob download (CSV/PDF/Excel)
Error: api interceptors -> toast + ErrorBoundary + Retry button in pages
Performance: React.memo on Card/Table row, useMemo filtered lists, useCallback handlers, lazy pages, Skeleton while suspend
```
