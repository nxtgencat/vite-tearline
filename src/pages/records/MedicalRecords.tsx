import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import FileUpload from '@/components/ui/FileUpload'
import Input from '@/components/ui/Input'
import { getStorage, setStorage } from '@/services/storage'
import { toast } from 'react-toastify'

type RecordItem = { id: string; patient: string; diagnosis: string; treatment: string; notes: string; allergies: string; visits: number; docs: string[] }

const KEY = 'hms_records'
const seed: RecordItem[] = [
  { id: 'R001', patient: 'Aarav Mehta', diagnosis: 'Hypertension Stage 1', treatment: 'Lifestyle + Amlodipine', notes: 'BP 140/90, advise low sodium', allergies: 'Penicillin', visits: 3, docs: [] },
  { id: 'R002', patient: 'Sneha Kapoor', diagnosis: 'Asthma', treatment: 'Inhaler', notes: 'Wheezing on exertion', allergies: 'Dust', visits: 5, docs: [] },
]

function MedicalRecords() {
  const [items, setItems] = useState<RecordItem[]>(() => getStorage(KEY, seed))
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ patient: '', diagnosis: '', treatment: '', notes: '', allergies: '', visits: 1 })
  const [uploads, setUploads] = useState<string[]>([])

  const save = () => {
    if (!form.patient || !form.diagnosis) { toast.error('Patient and diagnosis required'); return }
    let next: RecordItem[]
    if (editing) {
      next = items.map(i => i.id === editing ? { ...i, ...form, docs: [...i.docs, ...uploads] } : i)
    } else {
      next = [...items, { id: 'R'+Date.now(), ...form, docs: [...uploads] }]
    }
    setStorage(KEY, next); setItems(next); setShow(false); setEditing(null); setUploads([]); toast.success('Saved')
  }

  const openEdit = (id: string) => {
    const r = items.find(x=>x.id===id); if (!r) return
    setForm({ patient: r.patient, diagnosis: r.diagnosis, treatment: r.treatment, notes: r.notes, allergies: r.allergies, visits: r.visits })
    setEditing(id); setShow(true)
  }

  return (
    <div>
      <PageHeader title="Medical Records" subtitle="Diagnosis, treatment, notes, allergies & previous visits" action={<Button className="w-full sm:w-auto justify-center" onClick={()=>{ setForm({ patient: '', diagnosis: '', treatment: '', notes: '', allergies: '', visits: 1 }); setEditing(null); setShow(true)}}>+ Add Record</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(r => (
          <Card key={r.id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div><p className="font-medium">{r.patient}</p><p className="text-xs text-slate dark:text-slatedark">{r.id} • {r.visits} visits</p></div>
              <Badge variant="cobalt">{r.diagnosis.slice(0,20)}</Badge>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-slate dark:text-slatedark">Diagnosis:</span> {r.diagnosis}</p>
              <p><span className="text-slate dark:text-slatedark">Treatment:</span> {r.treatment}</p>
              <p><span className="text-slate dark:text-slatedark">Allergies:</span> {r.allergies}</p>
              <p><span className="text-slate dark:text-slatedark">Notes:</span> {r.notes}</p>
            </div>
            {r.docs.length>0 && <div className="flex flex-wrap gap-1">{r.docs.map(d=> <a key={d} href={d} target="_blank" rel="noreferrer" className="text-xs text-cobalt underline">Document</a>)}</div>}
            <div className="flex gap-2 pt-2 border-t border-line dark:border-linedark">
              <Button variant="outline" className="text-xs py-1.5" onClick={()=>openEdit(r.id)}>Edit</Button>
              <Button variant="ghost" className="text-xs py-1.5" onClick={()=>toast.success('History viewed')}>View History</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={show} onClose={()=>setShow(false)} title={editing?'Edit Record':'Add Record'}>
        <div className="space-y-3">
          <Input label="Patient" value={form.patient} onChange={e=>setForm({...form, patient: e.target.value})} />
          <Input label="Diagnosis" value={form.diagnosis} onChange={e=>setForm({...form, diagnosis: e.target.value})} />
          <Input label="Treatment" value={form.treatment} onChange={e=>setForm({...form, treatment: e.target.value})} />
          <Input label="Allergies" value={form.allergies} onChange={e=>setForm({...form, allergies: e.target.value})} />
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Doctor Notes</span><textarea value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} className="field min-h-[70px]" /></label>
          <FileUpload label="Upload Documents (PDF/Image)" onUploaded={u=> { if (u) setUploads(prev=>[...prev, u.url]) }} />
          {uploads.length>0 && <p className="text-xs text-mint">{uploads.length} file(s) ready</p>}
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(MedicalRecords)
