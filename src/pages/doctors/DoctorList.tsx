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
          <div key={d.id} className="card p-4 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex gap-3 items-start">
              {d.image ? <img src={d.image} alt={d.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-line dark:border-linedark shrink-0" /> : <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-cobalt/10 text-cobalt grid place-content-center font-semibold text-sm shrink-0">{d.name.split(' ').slice(-1)[0][0]}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate pr-1">{d.name}</p>
                <p className="text-xs text-slate dark:text-slatedark truncate">{d.department} • {d.qualification}</p>
                <p className="text-xs text-slate dark:text-slatedark">{d.experience}y exp • ₹{d.fee}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border leading-none ${d.status==='Available' ? 'bg-mint/15 text-mint border-mint/20' : d.status==='On Leave' ? 'bg-amber/15 text-amber border-amber/20' : 'bg-rose/15 text-rose border-rose/20'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${d.status==='Available' ? 'bg-mint' : d.status==='On Leave' ? 'bg-amber' : 'bg-rose'}`} /> {d.status}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate dark:text-slatedark bg-paper dark:bg-inkdark rounded-full px-3 py-1.5 border border-line dark:border-linedark w-fit max-w-full">
              <FiCalendar className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{d.availability}</span>
            </div>
            <p className="text-xs text-slate dark:text-slatedark mt-2 truncate">{d.mobile} • {d.email}</p>
            <button onClick={()=>setCalDoctor(d.id)} className="mt-3 w-full py-2 rounded-full border border-cobalt/20 bg-cobalt/5 hover:bg-cobalt hover:text-white text-cobalt text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"><FiCalendar className="w-3.5 h-3.5" /> Availability Calendar</button>
            {(can('doctors.edit') || can('doctors.delete')) && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-line dark:border-linedark">
                {can('doctors.edit') && <button onClick={()=>openEdit(d.id)} className="flex-1 py-2 rounded-full border border-line dark:border-linedark hover:border-ink dark:hover:border-paperdark hover:bg-ink/5 dark:hover:bg-white/5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /> Edit</button>}
                {can('doctors.delete') && <button onClick={()=>setConfirm(d.id)} className="flex-1 py-2 rounded-full border border-rose/20 bg-rose/5 hover:bg-rose hover:text-white text-rose text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /> Delete</button>}
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
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {days.map(d => {
                  const isAvailable = avail.includes(d.toLowerCase()) || avail.includes('mon-fri') && ['Mon','Tue','Wed','Thu','Fri'].includes(d) || avail.includes('mon-sat') && d!=='Sun'
                  return (
                    <div key={d} className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1 ${isAvailable ? 'bg-mint/15 border-mint/20 text-mint font-medium shadow-sm' : 'bg-paper border-line text-slate'}`}>
                      <p className="font-medium">{d}</p>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-mint' : 'bg-slate/40'}`} />
                      <p className="text-[10px] leading-none">{isAvailable ? 'Available' : 'Off'}</p>
                    </div>
                  )
                })}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Time Slots</p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(s => <div key={s} className="px-3 py-2 rounded-full border border-line dark:border-linedark bg-surface text-xs font-medium text-center hover:border-cobalt hover:bg-cobalt hover:text-white cursor-pointer transition-colors">{s}</div>)}
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
