import React, { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PageHeader from '@/components/layout/PageHeader'
import { getStorage } from '@/services/storage'
import { seedPatients, seedDoctors, seedAppointments, seedBilling, seedMedicines, seedLabReports } from '@/services/mockData'
import { formatCurrency } from '@/utils/format'
import { FiUsers, FiActivity, FiCalendar, FiCreditCard, FiPackage, FiDroplet, FiBell } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

type Stat = { label: string; value: string | number; icon: React.ReactNode; color: string; sub: string }

function Dashboard() {
  const navigate = useNavigate()
  const stats: Stat[] = useMemo(() => {
    const patients = getStorage('hms_patients', seedPatients).length
    const doctors = getStorage('hms_doctors', seedDoctors).length
    const appts = getStorage('hms_appointments', seedAppointments)
    const today = new Date().toISOString().slice(0,10)
    const todays = appts.filter((a: { date: string }) => a.date === today).length
    const billing = getStorage('hms_billing', seedBilling)
    const pending = billing.filter((b: { status: string }) => b.status === 'Pending').length
    const pharmacy = getStorage('hms_medicines', seedMedicines).length
    const labs = getStorage('hms_lab', seedLabReports).length
    const revenue = billing.reduce((s: number, b: { total: number }) => s + b.total, 0)
    return [
      { label: 'Total Patients', value: patients, icon: <FiUsers />, color: 'bg-cobalt', sub: '+4 this week' },
      { label: 'Total Doctors', value: doctors, icon: <FiActivity />, color: 'bg-mint', sub: '6 departments' },
      { label: "Today's Appointments", value: todays, icon: <FiCalendar />, color: 'bg-amber', sub: `${appts.length} total` },
      { label: 'Pending Bills', value: pending, icon: <FiCreditCard />, color: 'bg-rose', sub: formatCurrency(revenue) + ' revenue' },
      { label: 'Pharmacy Items', value: pharmacy, icon: <FiPackage />, color: 'bg-ink', sub: 'Low stock alerts active' },
      { label: 'Lab Reports', value: labs, icon: <FiDroplet />, color: 'bg-cobalt', sub: '2 pending' },
    ]
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Hospital overview & operational summary" action={<Badge variant="cobalt">Live • 30 min session</Badge>} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-4 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-lg ${s.color} text-white grid place-content-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
            <p className="text-[11px] text-slate dark:text-slatedark mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue Summary</h3>
            <Badge variant="mint">Last 7 days</Badge>
          </div>
          <div className="h-40 flex items-end gap-2">
            {[40, 65, 50, 85, 70, 95, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-cobalt/80 hover:bg-cobalt transition-colors" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-slate dark:text-slatedark">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-mint/15 text-mint">Consultation • 48%</span>
            <span className="px-2 py-1 rounded-full bg-amber/15 text-amber">Lab • 32%</span>
            <span className="px-2 py-1 rounded-full bg-cobalt/10 text-cobalt">Pharmacy • 20%</span>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Register Patient', path: '/patients' },
              { label: 'Book Appointment', path: '/appointments' },
              { label: 'Add Prescription', path: '/prescriptions' },
              { label: 'Generate Bill', path: '/billing' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="p-4 rounded-xl border border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark text-sm font-medium text-left">{a.label}</button>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-ink dark:bg-inkdark text-paper dark:text-paperdark">
            <p className="mini-tag !text-paper/60">Weather • New Delhi</p>
            <p className="text-2xl font-semibold mt-1">31° Partly Cloudy</p>
            <p className="text-xs text-paper/70">Humidity 62% • Feels like 34° • Good for outdoor triage</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><FiCalendar className="w-4 h-4" /> Recent Appointments</h3>
          <div className="space-y-3">
            {getStorage('hms_appointments', seedAppointments).slice(0,4).map((a: { id: string; patientName: string; doctorName: string; date: string; time: string; status: string }) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-line dark:border-linedark">
                <div><p className="text-sm font-medium">{a.patientName}</p><p className="text-xs text-slate dark:text-slatedark">{a.doctorName} • {a.date} {a.time}</p></div>
                <Badge variant={a.status === 'Upcoming' ? 'amber' : a.status === 'Completed' ? 'mint' : 'rose'}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2"><FiBell className="w-4 h-4" /> Recent Activities</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-mint mt-2 shrink-0" /> Patient Aarav Mehta registered by receptionist</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cobalt mt-2 shrink-0" /> Dr. Neha updated prescription PR001</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber mt-2 shrink-0" /> Lab report L001 marked completed</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose mt-2 shrink-0" /> Invoice B001 pending payment</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default React.memo(Dashboard)
