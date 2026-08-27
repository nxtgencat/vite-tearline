import type { Permission } from './roles'

export type NavItem = {
  label: string
  path: string
  icon: string
  permission?: Permission
  roles?: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard', permission: 'dashboard.view' },
  { label: 'Patients', path: '/patients', icon: 'Users', permission: 'patients.view' },
  { label: 'Doctors', path: '/doctors', icon: 'Stethoscope', permission: 'doctors.view' },
  { label: 'Appointments', path: '/appointments', icon: 'Calendar', permission: 'appointments.view' },
  { label: 'Medical Records', path: '/records', icon: 'FileText', permission: 'records.view' },
  { label: 'Prescriptions', path: '/prescriptions', icon: 'Pill', permission: 'prescriptions.view' },
  { label: 'Lab Reports', path: '/lab', icon: 'FlaskConical', permission: 'lab.view' },
  { label: 'Billing', path: '/billing', icon: 'Receipt', permission: 'billing.view' },
  { label: 'Pharmacy', path: '/pharmacy', icon: 'Package', permission: 'pharmacy.view' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell', permission: 'notifications.view' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3', permission: 'reports.view' },
]

export const BRANCHES = [
  { id: 'main', name: 'Central Hospital', lat: 28.6139, lng: 77.209, address: 'New Delhi, India' },
  { id: 'west', name: 'West Wing Branch', lat: 19.076, lng: 72.8777, address: 'Mumbai, India' },
  { id: 'south', name: 'South Care Center', lat: 12.9716, lng: 77.5946, address: 'Bengaluru, India' },
]
