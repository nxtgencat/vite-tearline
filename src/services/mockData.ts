export type Patient = {
  id: string
  name: string
  gender: 'Male' | 'Female' | 'Other'
  age: number
  mobile: string
  email: string
  bloodGroup: string
  address: string
  emergencyContact: string
  insurance: string
  medicalHistory: string
  status: 'Active' | 'Discharged' | 'Critical'
  photo?: string
  createdAt: string
}

export type Doctor = {
  id: string
  name: string
  department: string
  qualification: string
  experience: number
  fee: number
  mobile: string
  email: string
  availability: string
  status: 'Available' | 'On Leave' | 'Busy'
  image: string
}

export type Appointment = {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  reason: string
}

export type Prescription = {
  id: string
  patientId: string
  patientName: string
  doctorName: string
  date: string
  medicines: { name: string; dosage: string; duration: string; instructions: string }[]
}

export type LabReport = {
  id: string
  patientName: string
  test: string
  status: 'Pending' | 'Completed' | 'In Progress'
  date: string
  fileName?: string
}

export type Billing = {
  id: string
  patientName: string
  type: string
  amount: number
  discount: number
  tax: number
  total: number
  status: 'Paid' | 'Pending' | 'Overdue'
  date: string
}

export type Medicine = {
  id: string
  name: string
  category: string
  stock: number
  supplier: string
  price: number
  expiry: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: 'appointment' | 'billing' | 'prescription' | 'lab'
  read: boolean
  createdAt: string
}

const now = new Date().toISOString()

export const seedPatients: Patient[] = [
  { id: 'P001', name: 'Aarav Mehta', gender: 'Male', age: 34, mobile: '9876543210', email: 'aarav@email.com', bloodGroup: 'O+', address: 'New Delhi, India', emergencyContact: '9876500001', insurance: 'ICICI Lombard', medicalHistory: 'Hypertension', status: 'Active', photo: '', createdAt: now },
  { id: 'P002', name: 'Sneha Kapoor', gender: 'Female', age: 28, mobile: '9876543211', email: 'sneha@email.com', bloodGroup: 'A+', address: 'Mumbai, India', emergencyContact: '9876500002', insurance: 'Star Health', medicalHistory: 'Asthma', status: 'Active', createdAt: now },
  { id: 'P003', name: 'Vikram Singh', gender: 'Male', age: 45, mobile: '9876543212', email: 'vikram@email.com', bloodGroup: 'B+', address: 'Bengaluru, India', emergencyContact: '9876500003', insurance: 'HDFC Ergo', medicalHistory: 'Diabetes', status: 'Critical', createdAt: now },
  { id: 'P004', name: 'Priya Sharma', gender: 'Female', age: 31, mobile: '9876543213', email: 'priya@email.com', bloodGroup: 'AB+', address: 'Chennai, India', emergencyContact: '9876500004', insurance: 'Bajaj Allianz', medicalHistory: 'Thyroid', status: 'Discharged', createdAt: now },
  { id: 'P005', name: 'Rohan Das', gender: 'Male', age: 22, mobile: '9876543214', email: 'rohan@email.com', bloodGroup: 'O-', address: 'Kolkata, India', emergencyContact: '9876500005', insurance: 'LIC', medicalHistory: 'None', status: 'Active', createdAt: now },
  { id: 'P006', name: 'Ananya Gupta', gender: 'Female', age: 39, mobile: '9876543215', email: 'ananya@email.com', bloodGroup: 'A-', address: 'Pune, India', emergencyContact: '9876500006', insurance: 'Star Health', medicalHistory: 'Migraine', status: 'Active', createdAt: now },
]

export const seedDoctors: Doctor[] = [
  { id: 'D001', name: 'Dr. Neha Agarwal', department: 'Cardiology', qualification: 'MBBS, MD', experience: 12, fee: 1200, mobile: '9000011111', email: 'neha@hospital.com', availability: 'Mon-Fri 10am-4pm', status: 'Available', image: '' },
  { id: 'D002', name: 'Dr. Rajeev Kumar', department: 'Orthopedics', qualification: 'MBBS, MS', experience: 15, fee: 1500, mobile: '9000011112', email: 'rajeev@hospital.com', availability: 'Mon-Sat 9am-3pm', status: 'Available', image: '' },
  { id: 'D003', name: 'Dr. Sunita Reddy', department: 'Neurology', qualification: 'MBBS, DM', experience: 10, fee: 1800, mobile: '9000011113', email: 'sunita@hospital.com', availability: 'Tue-Sat 11am-5pm', status: 'On Leave', image: '' },
  { id: 'D004', name: 'Dr. Aman Patel', department: 'Pediatrics', qualification: 'MBBS, DCH', experience: 8, fee: 900, mobile: '9000011114', email: 'aman@hospital.com', availability: 'Mon-Fri 9am-2pm', status: 'Available', image: '' },
  { id: 'D005', name: 'Dr. Kavita Singh', department: 'Dermatology', qualification: 'MBBS, MD', experience: 7, fee: 800, mobile: '9000011115', email: 'kavita@hospital.com', availability: 'Mon-Wed 2pm-7pm', status: 'Busy', image: '' },
  { id: 'D006', name: 'Dr. Arjun Nair', department: 'ENT', qualification: 'MBBS, MS', experience: 9, fee: 1000, mobile: '9000011116', email: 'arjun@hospital.com', availability: 'Thu-Sat 10am-4pm', status: 'Available', image: '' },
]

export const seedAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'Aarav Mehta', doctorId: 'D001', doctorName: 'Dr. Neha Agarwal', date: new Date().toISOString().slice(0,10), time: '10:00', status: 'Upcoming', reason: 'Chest pain follow-up' },
  { id: 'A002', patientId: 'P002', patientName: 'Sneha Kapoor', doctorId: 'D002', doctorName: 'Dr. Rajeev Kumar', date: new Date(Date.now()-86400000).toISOString().slice(0,10), time: '11:30', status: 'Completed', reason: 'Knee pain' },
  { id: 'A003', patientId: 'P003', patientName: 'Vikram Singh', doctorId: 'D003', doctorName: 'Dr. Sunita Reddy', date: new Date().toISOString().slice(0,10), time: '14:00', status: 'Upcoming', reason: 'Headache' },
  { id: 'A004', patientId: 'P004', patientName: 'Priya Sharma', doctorId: 'D004', doctorName: 'Dr. Aman Patel', date: new Date(Date.now()-2*86400000).toISOString().slice(0,10), time: '09:00', status: 'Cancelled', reason: 'Fever' },
]

export const seedPrescriptions: Prescription[] = [
  { id: 'PR001', patientId: 'P001', patientName: 'Aarav Mehta', doctorName: 'Dr. Neha Agarwal', date: now, medicines: [{ name: 'Aspirin', dosage: '75mg', duration: '30 days', instructions: 'After food' }, { name: 'Atorvastatin', dosage: '20mg', duration: '30 days', instructions: 'Night' }] },
  { id: 'PR002', patientId: 'P002', patientName: 'Sneha Kapoor', doctorName: 'Dr. Rajeev Kumar', date: now, medicines: [{ name: 'Paracetamol', dosage: '500mg', duration: '5 days', instructions: 'Twice daily' }] },
]

export const seedLabReports: LabReport[] = [
  { id: 'L001', patientName: 'Aarav Mehta', test: 'CBC', status: 'Completed', date: now, fileName: 'CBC_report.pdf' },
  { id: 'L002', patientName: 'Sneha Kapoor', test: 'Lipid Profile', status: 'Pending', date: now },
  { id: 'L003', patientName: 'Vikram Singh', test: 'MRI Brain', status: 'In Progress', date: now },
]

export const seedBilling: Billing[] = [
  { id: 'B001', patientName: 'Aarav Mehta', type: 'Consultation', amount: 1200, discount: 100, tax: 108, total: 1208, status: 'Pending', date: now },
  { id: 'B002', patientName: 'Sneha Kapoor', type: 'Lab', amount: 2500, discount: 0, tax: 250, total: 2750, status: 'Paid', date: now },
  { id: 'B003', patientName: 'Vikram Singh', type: 'Pharmacy', amount: 840, discount: 40, tax: 80, total: 880, status: 'Overdue', date: now },
]

export const seedMedicines: Medicine[] = [
  { id: 'M001', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 120, supplier: 'Sun Pharma', price: 12, expiry: '2027-06-01' },
  { id: 'M002', name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 8, supplier: 'Cipla', price: 45, expiry: '2026-12-01' },
  { id: 'M003', name: 'Atorvastatin 20mg', category: 'Cardiac', stock: 45, supplier: 'Dr. Reddy', price: 89, expiry: '2027-03-15' },
  { id: 'M004', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 3, supplier: 'Mankind', price: 18, expiry: '2026-11-20' },
  { id: 'M005', name: 'Metformin 500mg', category: 'Diabetic', stock: 60, supplier: 'Lupin', price: 34, expiry: '2027-01-10' },
]

export const seedNotifications: Notification[] = [
  { id: 'N001', title: 'New Appointment', message: 'Aarav Mehta booked with Dr. Neha at 10:00', type: 'appointment', read: false, createdAt: now },
  { id: 'N002', title: 'Billing Pending', message: 'Invoice B001 pending for Aarav Mehta', type: 'billing', read: false, createdAt: now },
  { id: 'N003', title: 'Lab Report Ready', message: 'CBC report for Aarav Mehta is available', type: 'lab', read: true, createdAt: now },
]
