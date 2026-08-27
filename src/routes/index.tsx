import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleGuard from './RoleGuard'
import Loader from '@/components/ui/Loader'
import DashboardLayout from '@/layouts/DashboardLayout'

const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const PatientList = lazy(() => import('@/pages/patients/PatientList'))
const DoctorList = lazy(() => import('@/pages/doctors/DoctorList'))
const AppointmentList = lazy(() => import('@/pages/appointments/AppointmentList'))
const MedicalRecords = lazy(() => import('@/pages/records/MedicalRecords'))
const PrescriptionList = lazy(() => import('@/pages/prescriptions/PrescriptionList'))
const LabReports = lazy(() => import('@/pages/lab/LabReports'))
const BillingList = lazy(() => import('@/pages/billing/BillingList'))
const PharmacyList = lazy(() => import('@/pages/pharmacy/PharmacyList'))
const NotificationCenter = lazy(() => import('@/pages/notifications/NotificationCenter'))
const Reports = lazy(() => import('@/pages/reports/Reports'))

function Fallback() { return <Loader label="Loading page…" /> }

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<RoleGuard permission="patients.view"><PatientList /></RoleGuard>} />
          <Route path="doctors" element={<RoleGuard permission="doctors.view"><DoctorList /></RoleGuard>} />
          <Route path="appointments" element={<RoleGuard permission="appointments.view"><AppointmentList /></RoleGuard>} />
          <Route path="records" element={<RoleGuard permission="records.view"><MedicalRecords /></RoleGuard>} />
          <Route path="prescriptions" element={<RoleGuard permission="prescriptions.view"><PrescriptionList /></RoleGuard>} />
          <Route path="lab" element={<RoleGuard permission="lab.view"><LabReports /></RoleGuard>} />
          <Route path="billing" element={<RoleGuard permission="billing.view"><BillingList /></RoleGuard>} />
          <Route path="pharmacy" element={<RoleGuard permission="pharmacy.view"><PharmacyList /></RoleGuard>} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="reports" element={<RoleGuard permission="reports.view"><Reports /></RoleGuard>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
