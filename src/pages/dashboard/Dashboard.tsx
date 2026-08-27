import React, { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PageHeader from '@/components/layout/PageHeader'
import { getStorage } from '@/services/storage'
import { seedPatients, seedDoctors, seedAppointments, seedBilling, seedMedicines, seedLabReports, seedNotifications } from '@/services/mockData'
import { formatCurrency } from '@/utils/format'
import { FiUsers, FiActivity, FiCalendar, FiCreditCard, FiPackage, FiDroplet, FiBell, FiDollarSign } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

type Stat = { label: string; value: string | number; icon: React.ReactNode; color: string; sub: string }

function Dashboard() {
  const navigate = useNavigate()
  const data = useMemo(() => {
    const patients = getStorage('hms_patients', seedPatients)
    const doctors = getStorage('hms_doctors', seedDoctors)
    const appts = getStorage('hms_appointments', seedAppointments) as typeof seedAppointments
    const billing = getStorage('hms_billing', seedBilling) as typeof seedBilling
    const medicines = getStorage('hms_medicines', seedMedicines)
    const labs = getStorage('hms_lab', seedLabReports)
    const notifs = getStorage('hms_notifications', seedNotifications)
    const today = new Date().toISOString().slice(0,10)
    const todays = appts.filter(a => a.date === today)
    const pending = billing.filter(b => b.status === 'Pending')
    const lowStock = medicines.filter(m => m.stock < 10).length
    const revenue = billing.reduce((s, b) => s + b.total, 0)
    return { patients, doctors, appts, todays, billing, pending, medicines, labs, notifs, lowStock, revenue, today }
  }, [])

  const stats: Stat[] = [
    { label: 'Total Patients', value: data.patients.length, icon: <FiUsers />, color: 'bg-cobalt', sub: '+4 this week' },
    { label: 'Total Doctors', value: data.doctors.length, icon: <FiActivity />, color: 'bg-mint', sub: '6 departments' },
    { label: "Today's Appointments", value: data.todays.length, icon: <FiCalendar />, color: 'bg-amber', sub: `${data.appts.length} total` },
    { label: 'Pending Bills', value: data.pending.length, icon: <FiCreditCard />, color: 'bg-rose', sub: formatCurrency(data.revenue) + ' revenue' },
    { label: 'Pharmacy Orders', value: data.medicines.length, icon: <FiPackage />, color: 'bg-ink', sub: `${data.lowStock} low stock` },
    { label: 'Lab Reports', value: data.labs.length, icon: <FiDroplet />, color: 'bg-cobalt', sub: '2 pending' },
    { label: 'Notifications', value: data.notifs.filter(n=>!n.read).length, icon: <FiBell />, color: 'bg-amber', sub: `${data.notifs.length} total` },
    { label: 'Revenue', value: formatCurrency(data.revenue), icon: <FiDollarSign />, color: 'bg-mint', sub: 'All time' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Hospital overview & operational summary" action={<Badge variant="cobalt">Live • 30 min session</Badge>} />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-lg ${s.color} text-white grid place-content-center mb-2 sm:mb-3 shrink-0`}>{s.icon}</div>
            <p className="text-lg sm:text-xl font-semibold truncate">{s.value}</p>
            <p className="text-[11px] sm:text-xs font-medium leading-tight">{s.label}</p>
            <p className="text-[10px] sm:text-[11px] text-slate dark:text-slatedark mt-1 truncate">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-sm sm:text-base">Revenue Summary</h3>
            <Badge variant="mint">Last 7 days</Badge>
          </div>
          <div className="h-36 sm:h-44 flex items-end gap-1 sm:gap-2 bg-paper dark:bg-inkdark rounded-lg p-3 border border-line dark:border-linedark">
            {[40, 65, 50, 85, 70, 95, 60].map((h, i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1 sm:gap-2">
                <div className="w-full rounded-t-md sm:rounded-t-lg bg-cobalt hover:bg-cobalt-dark transition-colors" style={{ height: `${h}%`, minHeight: '8px' }} />
                <span className="text-[9px] sm:text-[10px] text-slate dark:text-slatedark">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
            <span className="px-2 py-1 rounded-full bg-mint/15 text-mint">Consultation • 48%</span>
            <span className="px-2 py-1 rounded-full bg-amber/15 text-amber">Lab • 32%</span>
            <span className="px-2 py-1 rounded-full bg-cobalt/10 text-cobalt">Pharmacy • 20%</span>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm sm:text-base mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { label: 'Register Patient', path: '/patients' },
              { label: 'Book Appointment', path: '/appointments' },
              { label: 'Add Prescription', path: '/prescriptions' },
              { label: 'Generate Bill', path: '/billing' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="p-3 sm:p-4 rounded-xl border border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark hover:bg-ink/5 dark:hover:bg-white/5 text-xs sm:text-sm font-medium text-left transition-colors">{a.label}</button>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-ink dark:bg-surfacedark text-paper dark:text-paperdark">
            <p className="mini-tag !text-paper/60">Weather • New Delhi</p>
            <p className="text-xl sm:text-2xl font-semibold mt-1">31° Partly Cloudy</p>
            <p className="text-xs text-paper/70">Humidity 62% • Feels like 34° • Good for outdoor triage</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2"><FiCalendar className="w-4 h-4" /> Appointments Trend (7 days)</h3>
          <div className="h-36 sm:h-44 flex items-end gap-1 sm:gap-2 bg-paper dark:bg-inkdark rounded-lg p-3 border border-line dark:border-linedark">
            {[12, 18, 8, 22, 15, 25, data.todays.length || 6].map((v, i) => {
              const h = 30 + (v * 2.5)
              return (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-[9px] text-slate dark:text-slatedark">{v}</span>
                  <div className="w-full rounded-t-md bg-amber hover:bg-amber/80 transition-colors" style={{ height: `${Math.min(h, 95)}%`, minHeight: '12px' }} />
                  <span className="text-[9px] sm:text-[10px] text-slate dark:text-slatedark">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              )
            })}
          </div>
          <p className="text-[11px] text-slate dark:text-slatedark mt-2">Today ({data.today}) : {data.todays.length} appointments</p>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2"><FiActivity className="w-4 h-4" /> Doctor Today&apos;s Schedule — {data.today}</h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {data.doctors.slice(0,6).map(doc => {
              const todaysForDoc = data.todays.filter(a => a.doctorId === doc.id)
              return (
                <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg border border-line dark:border-linedark">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-slate dark:text-slatedark">{doc.department} • {doc.availability}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-sm font-semibold">{todaysForDoc.length}</p>
                    <p className="text-[11px] text-slate dark:text-slatedark">today</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-cobalt/5 border border-cobalt/10 text-xs">
            Total today: <span className="font-semibold">{data.todays.length}</span> • Upcoming: {data.todays.filter(a=>a.status==='Upcoming').length} • Completed: {data.todays.filter(a=>a.status==='Completed').length}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2"><FiCalendar className="w-4 h-4" /> Recent Appointments</h3>
          <div className="space-y-3">
            {data.appts.slice(0,4).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-line dark:border-linedark gap-2">
                <div className="min-w-0"><p className="text-sm font-medium truncate">{a.patientName}</p><p className="text-xs text-slate dark:text-slatedark truncate">{a.doctorName} • {a.date} {a.time}</p></div>
                <Badge variant={a.status === 'Upcoming' ? 'amber' : a.status === 'Completed' ? 'mint' : 'rose'}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2"><FiBell className="w-4 h-4" /> Recent Activities</h3>
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
