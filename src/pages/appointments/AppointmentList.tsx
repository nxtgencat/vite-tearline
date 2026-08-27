import React, { useState, useMemo } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import { useAppointments } from '@/hooks/useAppointments'
import { useDoctors } from '@/hooks/useDoctors'
import { usePatients } from '@/hooks/usePatients'
import { usePermission } from '@/hooks/usePermission'
import { sendEmail } from '@/services/email'
import { toast } from '@/components/ui/Sonner'
import { useForm } from 'react-hook-form'

function AppointmentList() {
  const { items, create, updateStatus } = useAppointments()
  const { items: doctors } = useDoctors()
  const { items: patients } = usePatients()
  const { can } = usePermission()
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [show, setShow] = useState(false)
  const [reschedId, setReschedId] = useState<string | null>(null)
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: { patientId: '', doctorId: '', date: new Date().toISOString().slice(0,10), time: '10:00', reason: '' } })
  const watchDoctor = watch('doctorId')
  const watchDate = watch('date')

  const filtered = useMemo(() => {
    let out = filter==='All' ? [...items] : items.filter(a=>a.status===filter)
    if (doctorFilter !== 'All') out = out.filter(a=>a.doctorId===doctorFilter)
    return out
  }, [items, filter, doctorFilter])

  const onBook = async (data: never) => {
    const d = data as { patientId: string; doctorId: string; date: string; time: string; reason: string }
    const patient = patients.find(p=>p.id===d.patientId)
    const doctor = doctors.find(doc=>doc.id===d.doctorId)
    if (!patient || !doctor) { toast.error('Select patient and doctor'); return }
    const clash = items.some(a => a.doctorId===doctor.id && a.date===d.date && a.time===d.time && a.status==='Upcoming' && a.id !== reschedId)
    if (clash) { toast.error('Slot already booked for this doctor'); return }
    if (reschedId) {
      await updateStatus(reschedId, 'Cancelled')
      await create({ patientId: patient.id, patientName: patient.name, doctorId: doctor.id, doctorName: doctor.name, date: d.date, time: d.time, reason: d.reason, status: 'Upcoming' })
      toast.success('Rescheduled & email sent')
    } else {
      await create({ patientId: patient.id, patientName: patient.name, doctorId: doctor.id, doctorName: doctor.name, date: d.date, time: d.time, reason: d.reason, status: 'Upcoming' })
      toast.success('Appointment booked & email sent (mock)')
    }
    await sendEmail('appointment_confirm', patient.email, { patient: patient.name, doctor: doctor.name, date: d.date, time: d.time })
    setShow(false); reset()
  }

  const cancel = async (id: string) => {
    await updateStatus(id, 'Cancelled')
    const a = items.find(x=>x.id===id)
    if (a) await sendEmail('appointment_cancel', 'patient@example.com', { id })
    toast.success('Cancelled & email sent')
  }
  const complete = async (id: string) => { await updateStatus(id, 'Completed'); toast.success('Marked completed') }

  const doctorToday = useMemo(() => {
    if (!watchDoctor) return []
    const today = watchDate || new Date().toISOString().slice(0,10)
    return items.filter(a => a.doctorId === watchDoctor && a.date === today)
  }, [items, watchDoctor, watchDate])
  const slotTaken = useMemo(() => {
    if (!watchDoctor || !watchDate) return false
    const time = watch('time')
    return doctorToday.some(a => a.time === time && a.status === 'Upcoming')
  }, [doctorToday, watchDoctor, watchDate, watch])

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'patientName', header: 'Patient' },
    { key: 'doctorName', header: 'Doctor' },
    { key: 'date', header: 'Date' },
    { key: 'time', header: 'Time' },
    { key: 'status', header: 'Status', render: (r: (typeof items)[0]) => <Badge variant={r.status==='Upcoming'?'amber':r.status==='Completed'?'mint':'rose'}>{r.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (r: (typeof items)[0]) => (
      <div className="flex gap-1">
        {r.status==='Upcoming' && can('appointments.edit') && <>
          <button onClick={()=>cancel(r.id)} className="px-2 py-1 rounded-full border border-rose text-rose text-xs">Cancel</button>
          <button onClick={()=>complete(r.id)} className="px-2 py-1 rounded-full border border-mint text-mint text-xs">Complete</button>
          <button onClick={()=>{ setReschedId(r.id); setShow(true); reset({ patientId: r.patientId, doctorId: r.doctorId, date: r.date, time: r.time, reason: r.reason })}} className="px-2 py-1 rounded-full border border-line dark:border-linedark text-xs">Reschedule</button>
        </>}
      </div>
    ) },
  ]

  return (
    <div>
      <PageHeader title="Appointments" subtitle="Book, cancel, reschedule & view by status" action={can('appointments.create') ? <Button onClick={()=>{ setReschedId(null); setShow(true) }} className="w-full sm:w-auto justify-center">+ Book Appointment</Button> : null} />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {(['All','Upcoming','Completed','Cancelled'] as const).map(s => (
            <button key={s} onClick={()=>setFilter(s)} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border ${filter===s ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark border-ink' : 'border-line dark:border-linedark'}`}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate dark:text-slatedark hidden sm:inline">Doctor:</span>
          <select value={doctorFilter} onChange={e=>setDoctorFilter(e.target.value)} className="px-3 py-1.5 rounded-full border border-line dark:border-linedark text-xs bg-surface dark:bg-surfacedark">
            <option value="All">All Doctors</option>
            {doctors.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      {doctorFilter !== 'All' && (
        <div className="mb-4 p-3 rounded-lg bg-cobalt/5 border border-cobalt/10 text-xs">
          <p className="font-medium">Dr. {doctors.find(d=>d.id===doctorFilter)?.name} — whole day schedule {new Date().toISOString().slice(0,10)}</p>
          <p className="text-slate dark:text-slatedark">{items.filter(a=>a.doctorId===doctorFilter && a.date===new Date().toISOString().slice(0,10)).length} appointments today • {items.filter(a=>a.doctorId===doctorFilter).length} total</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {items.filter(a=>a.doctorId===doctorFilter).slice(0,6).map(a=> <span key={a.id} className="px-2 py-1 rounded-full bg-surface border border-line text-[11px]">{a.time} {a.patientName.split(' ')[0]}</span>)}
          </div>
        </div>
      )}
      <Table columns={columns as never} data={filtered as never} />
      {filtered.length===0 && <p className="text-sm text-center py-8 text-slate dark:text-slatedark">No appointments</p>}

      <Modal open={show} onClose={()=>setShow(false)} title={reschedId ? 'Reschedule' : 'Book Appointment'}>
        <form onSubmit={handleSubmit(onBook as never)} className="space-y-3">
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Patient</span>
            <select {...register('patientId')} className="field"><option value="">Select patient</option>{patients.map(p=> <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}</select>
          </label>
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Doctor</span>
            <select {...register('doctorId')} className="field"><option value="">Select doctor</option>{doctors.map(d=> <option key={d.id} value={d.id}>{d.name} — {d.department}</option>)}</select>
          </label>
          {watchDoctor && (
            <div className="p-3 rounded-lg bg-amber/5 border border-amber/20 text-xs">
              <p className="font-medium">Dr. {doctors.find(d=>d.id===watchDoctor)?.name} — {watchDate} schedule</p>
              {doctorToday.length === 0 ? <p className="text-slate dark:text-slatedark mt-1">No appointments on this date — all slots free</p> : (
                <div className="mt-2 flex flex-wrap gap-1">
                  {doctorToday.map(a=> <span key={a.id} className={`px-2 py-1 rounded-full text-[11px] border ${a.status==='Upcoming' ? 'bg-amber/15 border-amber/30 text-amber' : 'bg-ink/5 border-line'}`}>{a.time} • {a.patientName.split(' ')[0]} • {a.status}</span>)}
                </div>
              )}
              {slotTaken && <p className="text-rose mt-2 font-medium">⚠ Selected slot is already booked — choose another</p>}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Date" type="date" {...register('date')} />
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Time Slot</span>
              <select {...register('time')} className="field"><option>09:00</option><option>10:00</option><option>11:30</option><option>14:00</option><option>15:30</option><option>16:30</option></select>
            </label>
          </div>
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Reason</span><textarea {...register('reason')} className="field min-h-[60px]" placeholder="Reason for visit" /></label>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={()=>setShow(false)}>Close</Button><Button type="submit" disabled={slotTaken}>{reschedId ? 'Update' : 'Book'}</Button></div>
        </form>
        <div className="mt-4 rounded-lg bg-paper dark:bg-inkdark p-3 border border-dashed border-line dark:border-linedark text-xs text-slate dark:text-slatedark">
          Slots are 30 min. EmailJS mock will send confirmation/cancellation.
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(AppointmentList)
