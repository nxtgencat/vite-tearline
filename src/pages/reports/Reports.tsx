import React, { useMemo } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getStorage } from '@/services/storage'
import { seedPatients, seedDoctors, seedAppointments, seedBilling, seedMedicines, seedLabReports } from '@/services/mockData'
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/export'
import { toast } from 'react-toastify'

function Reports() {
  const data = useMemo(()=>({
    patients: getStorage('hms_patients', seedPatients),
    doctors: getStorage('hms_doctors', seedDoctors),
    appointments: getStorage('hms_appointments', seedAppointments),
    billing: getStorage('hms_billing', seedBilling),
    medicines: getStorage('hms_medicines', seedMedicines),
    lab: getStorage('hms_lab', seedLabReports),
  }), [])

  const doExport = (rows: Record<string, unknown>[], name: string, kind: 'csv'|'pdf'|'excel') => {
    if (kind==='csv') exportToCSV(rows, `${name}.csv`)
    else if (kind==='excel') exportToExcel(rows, `${name}.xls`)
    else exportToPDF(name, rows, `${name}.pdf`)
    toast.success(`${name} exported as ${kind}`)
  }

  const sections = [
    { title: 'Patients', rows: data.patients.map(p=>({ ID:p.id, Name:p.name, Gender:p.gender, Age:p.age, Status:p.status })) },
    { title: 'Doctors', rows: data.doctors.map(d=>({ ID:d.id, Name:d.name, Dept:d.department, Status:d.status })) },
    { title: 'Appointments', rows: data.appointments.map(a=>({ ID:a.id, Patient:a.patientName, Doctor:a.doctorName, Date:a.date, Status:a.status })) },
    { title: 'Billing', rows: data.billing.map(b=>({ ID:b.id, Patient:b.patientName, Type:b.type, Total:b.total, Status:b.status })) },
    { title: 'Pharmacy', rows: data.medicines.map(m=>({ ID:m.id, Name:m.name, Category:m.category, Stock:m.stock, Price:m.price })) },
    { title: 'Laboratory', rows: data.lab.map(l=>({ ID:l.id, Test:l.test, Patient:l.patientName, Status:l.status })) },
  ]

  return (
    <div>
      <PageHeader title="Reports" subtitle="Patients, doctors, appointments, billing, pharmacy, lab — export PDF/Excel/CSV" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(s=>(
          <Card key={s.title}>
            <div className="flex justify-between items-start mb-3">
              <div><h3 className="font-semibold">{s.title}</h3><p className="text-xs text-slate dark:text-slatedark">{s.rows.length} records</p></div>
              <div className="flex gap-1">
                <button onClick={()=>doExport(s.rows as never, s.title.toLowerCase(), 'csv')} className="px-2 py-1 rounded-full border border-line dark:border-linedark text-xs">CSV</button>
                <button onClick={()=>doExport(s.rows as never, s.title.toLowerCase(), 'excel')} className="px-2 py-1 rounded-full border border-line dark:border-linedark text-xs">Excel</button>
                <button onClick={()=>doExport(s.rows as never, s.title.toLowerCase(), 'pdf')} className="px-2 py-1 rounded-full bg-ink dark:bg-paperdark text-paper dark:text-inkdark text-xs">PDF</button>
              </div>
            </div>
            <div className="h-24 flex items-end gap-1">
              {s.rows.slice(0,7).map((_, i)=> <div key={i} className="flex-1 rounded-t bg-cobalt/60" style={{ height: `${30 + ((i*17)%60)}%` }} />)}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-xs" onClick={()=>doExport(s.rows as never, s.title.toLowerCase(), 'csv')}>Download {s.title} Report</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Reports)
