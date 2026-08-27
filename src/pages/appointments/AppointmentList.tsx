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
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

function AppointmentList() {
  const { items, create, updateStatus } = useAppointments()
  const { items: doctors } = useDoctors()
  const { items: patients } = usePatients()
  const { can } = usePermission()
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All')
  const [show, setShow] = useState(false)
  const [reschedId, setReschedId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { patientId: '', doctorId: '', date: new Date().toISOString().slice(0,10), time: '10:00', reason: '' } })

  const filtered = useMemo(() => filter==='All' ? items : items.filter(a=>a.status===filter), [items, filter])

  const onBook = async (data: never) => {
    const d = data as { patientId: string; doctorId: string; date: string; time: string; reason: string }
    const patient = patients.find(p=>p.id===d.patientId)
    const doctor = doctors.find(doc=>doc.id===d.doctorId)
    if (!patient || !doctor) { toast.error('Select patient and doctor'); return }
    await create({ patientId: patient.id, patientName: patient.name, doctorId: doctor.id, doctorName: doctor.name, date: d.date, time: d.time, reason: d.reason, status: 'Upcoming' })
    await sendEmail('appointment_confirm', patient.email, { patient: patient.name, doctor: doctor.name, date: d.date, time: d.time })
    toast.success('Appointment booked & email sent (mock)')
    setShow(false); reset()
  }

  const cancel = async (id: string) => {
    await updateStatus(id, 'Cancelled')
    const a = items.find(x=>x.id===id)
    if (a) await sendEmail('appointment_cancel', 'patient@example.com', { id })
    toast.success('Cancelled & email sent')
  }
  const complete = async (id: string) => { await updateStatus(id, 'Completed'); toast.success('Marked completed') }

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
      <div className="flex flex-wrap gap-2 mb-4">
        {(['All','Upcoming','Completed','Cancelled'] as const).map(s => (
          <button key={s} onClick={()=>setFilter(s)} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border ${filter===s ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark border-ink' : 'border-line dark:border-linedark'}`}>{s}</button>
        ))}
      </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Date" type="date" {...register('date')} />
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Time Slot</span>
              <select {...register('time')} className="field"><option>09:00</option><option>10:00</option><option>11:30</option><option>14:00</option><option>15:30</option><option>16:30</option></select>
            </label>
          </div>
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Reason</span><textarea {...register('reason')} className="field min-h-[60px]" placeholder="Reason for visit" /></label>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={()=>setShow(false)}>Close</Button><Button type="submit">{reschedId ? 'Update' : 'Book'}</Button></div>
        </form>
        <div className="mt-4 rounded-lg bg-paper dark:bg-inkdark p-3 border border-dashed border-line dark:border-linedark text-xs text-slate dark:text-slatedark">
          Slots are 30 min. EmailJS mock will send confirmation/cancellation.
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(AppointmentList)
