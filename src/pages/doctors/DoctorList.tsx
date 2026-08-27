import React, { useMemo, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import FilterPanel from '@/components/ui/FilterPanel'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import FileUpload from '@/components/ui/FileUpload'
import { useDoctors } from '@/hooks/useDoctors'
import { usePermission } from '@/hooks/usePermission'
import { useDebounce } from '@/hooks/useDebounce'
import { toast } from '@/components/ui/Sonner'
import { useForm } from 'react-hook-form'
import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi'

function DoctorList() {
  const { items, create, update, remove } = useDoctors()
  const { can } = usePermission()
  const [query, setQuery] = useState('')
  const deb = useDebounce(query, 300)
  const [dept, setDept] = useState('All')
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [calDoctor, setCalDoctor] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let out = [...items]
    if (deb) { const q = deb.toLowerCase(); out = out.filter(d => d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q) || d.email.toLowerCase().includes(q)) }
    if (dept !== 'All') out = out.filter(d => d.department === dept)
    return out
  }, [items, deb, dept])

  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', department: 'Cardiology', qualification: '', experience: 5, fee: 1000, mobile: '', email: '', availability: '', status: 'Available' } })

  const openCreate = () => { reset({ name: '', department: 'Cardiology', qualification: '', experience: 5, fee: 1000, mobile: '', email: '', availability: 'Mon-Fri 10am-4pm', status: 'Available' }); setEditing(null); setPhoto(null); setShow(true) }
  const openEdit = (id: string) => {
    const d = items.find(x => x.id === id); if (!d) return
    reset({ name: d.name, department: d.department, qualification: d.qualification, experience: d.experience, fee: d.fee, mobile: d.mobile, email: d.email, availability: d.availability, status: d.status }); setEditing(id); setPhoto(d.image || null); setShow(true)
  }

  const onSubmit = async (data: never) => {
    const d = data as { name: string; department: string; qualification: string; experience: number; fee: number; mobile: string; email: string; availability: string; status: string }
    const payload = { ...d, image: photo || '', status: d.status as never }
    if (editing) { await update(editing, payload); toast.success('Doctor updated') } else { await create(payload as never); toast.success('Doctor added') }
    setShow(false)
  }

  const depts = ['All','Cardiology','Orthopedics','Neurology','Pediatrics','Dermatology','ENT']

  return (
    <div>
      <PageHeader title="Doctors" subtitle="Search, filter by department, view availability" action={can('doctors.create') ? <Button onClick={openCreate} className="w-full sm:w-auto justify-center">+ Add Doctor</Button> : null} />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 min-w-0"><SearchBar value={query} onChange={setQuery} placeholder="Search doctors…" /></div>
        <FilterPanel label="Department" value={dept} options={depts.map(d=>({label:d,value:d}))} onChange={setDept} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d.id} className="card p-4 flex flex-col">
            <div className="flex gap-3">
              {d.image ? <img src={d.image} alt={d.name} className="w-12 h-12 rounded-xl object-cover border border-line dark:border-linedark" /> : <div className="w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt grid place-content-center font-semibold">{d.name.split(' ').slice(-1)[0][0]}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{d.name}</p>
                <p className="text-xs text-slate dark:text-slatedark">{d.department} • {d.qualification}</p>
                <p className="text-xs text-slate dark:text-slatedark">{d.experience}y exp • ₹{d.fee}</p>
              </div>
              <Badge variant={d.status==='Available' ? 'mint' : d.status==='On Leave' ? 'amber' : 'rose'}>{d.status}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate dark:text-slatedark"><FiCalendar className="w-3.5 h-3.5" /> {d.availability}</div>
            <p className="text-xs text-slate dark:text-slatedark mt-1 truncate">{d.mobile} • {d.email}</p>
            <button onClick={()=>setCalDoctor(d.id)} className="mt-3 w-full py-1.5 rounded-full bg-cobalt/5 hover:bg-cobalt/10 text-cobalt text-xs font-medium flex items-center justify-center gap-1"><FiCalendar className="w-3 h-3" /> Availability Calendar</button>
            {(can('doctors.edit') || can('doctors.delete')) && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-line dark:border-linedark">
                {can('doctors.edit') && <button onClick={()=>openEdit(d.id)} className="flex-1 py-1.5 rounded-full border border-line dark:border-linedark text-xs flex items-center justify-center gap-1"><FiEdit2 className="w-3 h-3" /> Edit</button>}
                {can('doctors.delete') && <button onClick={()=>setConfirm(d.id)} className="flex-1 py-1.5 rounded-full border border-rose text-rose text-xs flex items-center justify-center gap-1"><FiTrash2 className="w-3 h-3" /> Delete</button>}
              </div>
            )}
          </div>
        ))}
      </div>
      {filtered.length===0 && <p className="text-sm text-center py-10 text-slate dark:text-slatedark">No doctors found</p>}

      <Modal open={show} onClose={()=>setShow(false)} title={editing?'Edit Doctor':'Add Doctor'}>
        <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-3">
          <Input label="Name" {...register('name')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Department</span><select {...register('department')} className="field"><option>Cardiology</option><option>Orthopedics</option><option>Neurology</option><option>Pediatrics</option><option>Dermatology</option><option>ENT</option></select></label>
            <Input label="Qualification" {...register('qualification')} />
            <Input label="Experience (years)" type="number" {...register('experience')} />
            <Input label="Fee (₹)" type="number" {...register('fee')} />
            <Input label="Mobile" {...register('mobile')} />
            <Input label="Email" {...register('email')} />
            <Input label="Availability" {...register('availability')} />
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Status</span><select {...register('status')} className="field"><option>Available</option><option>On Leave</option><option>Busy</option></select></label>
          </div>
          <FileUpload label="Profile Image" onUploaded={u=>setPhoto(u?.url ?? null)} />
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>

      {confirm && (
        <Modal open={!!confirm} onClose={()=>setConfirm(null)} title="Delete doctor">
          <p className="text-sm mb-4">Delete this doctor? This cannot be undone.</p>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setConfirm(null)}>Cancel</Button><Button className="bg-rose" onClick={async()=>{ await remove(confirm); toast.success('Deleted'); setConfirm(null)}}>Delete</Button></div>
        </Modal>
      )}

      <Modal open={!!calDoctor} onClose={()=>setCalDoctor(null)} title="Availability Calendar">
        {(() => {
          const doc = items.find(x=>x.id===calDoctor)
          if (!doc) return null
          const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
          const avail = doc.availability.toLowerCase()
          const slots = ['09:00','10:00','11:30','14:00','15:30','16:30']
          return (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-cobalt/5 border border-cobalt/10">
                <p className="font-medium text-sm">{doc.name} • {doc.department}</p>
                <p className="text-xs text-slate dark:text-slatedark">{doc.availability} • {doc.status}</p>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map(d => {
                  const isAvailable = avail.includes(d.toLowerCase()) || avail.includes('mon-fri') && ['Mon','Tue','Wed','Thu','Fri'].includes(d) || avail.includes('mon-sat') && d!=='Sun'
                  return (
                    <div key={d} className={`p-2 rounded-lg border text-xs ${isAvailable ? 'bg-mint/10 border-mint/30 text-mint font-medium' : 'bg-ink/5 border-line text-slate'}`}>
                      <p>{d}</p>
                      <p className="text-[10px] mt-1">{isAvailable ? '● Available' : '○ Off'}</p>
                    </div>
                  )
                })}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Time Slots</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(s => <div key={s} className="px-2 py-1.5 rounded-full border border-line dark:border-linedark text-xs text-center hover:border-cobalt hover:text-cobalt cursor-pointer">{s}</div>)}
                </div>
              </div>
              <p className="text-xs text-slate dark:text-slatedark">Select a slot in Appointments to book. Green days are when {doc.name.split(' ').slice(-1)} is available.</p>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}

export default React.memo(DoctorList)
