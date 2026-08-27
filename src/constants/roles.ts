export type Role = 'admin' | 'doctor' | 'receptionist' | 'patient'

export type Permission =
  | 'patients.view' | 'patients.create' | 'patients.edit' | 'patients.delete'
  | 'doctors.view' | 'doctors.create' | 'doctors.edit' | 'doctors.delete'
  | 'appointments.view' | 'appointments.create' | 'appointments.edit' | 'appointments.delete'
  | 'records.view' | 'records.edit'
  | 'prescriptions.view' | 'prescriptions.create' | 'prescriptions.edit'
  | 'lab.view' | 'lab.create' | 'lab.edit'
  | 'billing.view' | 'billing.create' | 'billing.edit'
  | 'pharmacy.view' | 'pharmacy.create' | 'pharmacy.edit' | 'pharmacy.delete'
  | 'reports.view' | 'reports.export'
  | 'dashboard.view' | 'users.manage' | 'notifications.view'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'patients.view','patients.create','patients.edit','patients.delete',
    'doctors.view','doctors.create','doctors.edit','doctors.delete',
    'appointments.view','appointments.create','appointments.edit','appointments.delete',
    'records.view','records.edit',
    'prescriptions.view','prescriptions.create','prescriptions.edit',
    'lab.view','lab.create','lab.edit',
    'billing.view','billing.create','billing.edit',
    'pharmacy.view','pharmacy.create','pharmacy.edit','pharmacy.delete',
    'reports.view','reports.export',
    'dashboard.view','users.manage','notifications.view'
  ],
  doctor: [
    'patients.view',
    'doctors.view',
    'appointments.view','appointments.edit',
    'records.view','records.edit',
    'prescriptions.view','prescriptions.create','prescriptions.edit',
    'lab.view',
    'notifications.view','dashboard.view'
  ],
  receptionist: [
    'patients.view','patients.create','patients.edit',
    'doctors.view',
    'appointments.view','appointments.create','appointments.edit','appointments.delete',
    'billing.view','billing.create','billing.edit',
    'notifications.view','dashboard.view'
  ],
  patient: [
    'appointments.view','appointments.create',
    'prescriptions.view',
    'lab.view',
    'billing.view',
    'notifications.view','dashboard.view'
  ]
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  doctor: 'Doctor',
  receptionist: 'Receptionist',
  patient: 'Patient'
}

export const ALL_ROLES: Role[] = ['admin','doctor','receptionist','patient']
