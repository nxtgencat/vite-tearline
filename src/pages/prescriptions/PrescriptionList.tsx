import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { getStorage, setStorage } from '@/services/storage'
import { seedPrescriptions, type Prescription } from '@/services/mockData'
import { toast } from 'react-toastify'
import { exportToPDF } from '@/utils/export'
import { usePermission } from '@/hooks/usePermission'

const KEY = 'hms_prescriptions'

function PrescriptionList() {
  const [items, setItems] = useState<Prescription[]>(() => getStorage(KEY, seedPrescriptions))
  const { can } = usePermission()
  const [show, setShow] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [patientName, setPatientName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [meds, setMeds] = useState<{ name: string; dosage: string; duration: string; instructions: string }[]>([{ name: '', dosage: '', duration: '', instructions: '' }])

  const save = () => {
    const filtered = meds.filter(m=>m.name)
    if (!patientName || filtered.length===0) { toast.error('Patient and at least one medicine required'); return }
    let next: Prescription[]
    if (editingId) {
      next = items.map(i=> i.id===editingId ? { ...i, patientName, doctorName, medicines: filtered } : i)
      toast.success('Updated')
    } else {
      next = [...items, { id: 'PR'+Date.now(), patientId: 'P'+Date.now(), patientName, doctorName: doctorName || 'Dr. Neha Agarwal', date: new Date().toISOString(), medicines: filtered }]
      toast.success('Created')
    }
    setStorage(KEY, next); setItems(next); setShow(false); setEditingId(null)
  }

  const openEdit = (p: Prescription) => { setPatientName(p.patientName); setDoctorName(p.doctorName); setMeds(p.medicines); setEditingId(p.id); setShow(true) }

  const exportPDF = (p: Prescription) => {
    exportToPDF(`Prescription_${p.id}`, p.medicines.map(m=>({ Patient: p.patientName, Doctor: p.doctorName, Medicine: m.name, Dosage: m.dosage, Duration: m.duration, Instructions: m.instructions })), `Prescription_${p.id}.pdf`)
    toast.success('PDF exported (mock)')
  }

  return (
    <div>
      <PageHeader title="Prescriptions" subtitle="Create, edit, view history & export PDF" action={can('prescriptions.create') ? <Button className="w-full sm:w-auto justify-center" onClick={()=>{ setPatientName(''); setDoctorName(''); setMeds([{ name: '', dosage: '', duration: '', instructions: '' }]); setEditingId(null); setShow(true)}}>+ New Prescription</Button> : null} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(p => (
          <Card key={p.id}>
            <div className="flex justify-between items-start">
              <div><p className="font-medium">{p.patientName}</p><p className="text-xs text-slate dark:text-slatedark">{p.id} • {new Date(p.date).toLocaleDateString()} • {p.doctorName}</p></div>
              <Button variant="outline" className="text-xs py-1" onClick={()=>exportPDF(p)}>Export PDF</Button>
            </div>
            <div className="mt-3 divide-y divide-line dark:divide-linedark border border-line dark:border-linedark rounded-lg overflow-hidden">
              {p.medicines.map((m, idx) => (
                <div key={idx} className="p-3 text-xs grid grid-cols-2 gap-2">
                  <span className="font-medium col-span-2">{m.name}</span>
                  <span>Dosage: {m.dosage}</span><span>Duration: {m.duration}</span>
                  <span className="col-span-2 text-slate dark:text-slatedark">Instructions: {m.instructions}</span>
                </div>
              ))}
            </div>
            {can('prescriptions.edit') && <Button variant="ghost" className="mt-3 text-xs" onClick={()=>openEdit(p)}>Edit</Button>}
          </Card>
        ))}
      </div>

      <Modal open={show} onClose={()=>setShow(false)} title={editingId?'Edit Prescription':'Create Prescription'}>
        <div className="space-y-3">
          <Input label="Patient Name" value={patientName} onChange={e=>setPatientName(e.target.value)} />
          <Input label="Doctor Name" value={doctorName} onChange={e=>setDoctorName(e.target.value)} />
          {meds.map((m, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-line dark:border-linedark">
              <Input label="Medicine" value={m.name} onChange={e=>{ const n=[...meds]; n[i].name=e.target.value; setMeds(n)}} />
              <Input label="Dosage" value={m.dosage} onChange={e=>{ const n=[...meds]; n[i].dosage=e.target.value; setMeds(n)}} />
              <Input label="Duration" value={m.duration} onChange={e=>{ const n=[...meds]; n[i].duration=e.target.value; setMeds(n)}} />
              <Input label="Instructions" value={m.instructions} onChange={e=>{ const n=[...meds]; n[i].instructions=e.target.value; setMeds(n)}} />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="text-xs" onClick={()=>setMeds([...meds, { name: '', dosage: '', duration: '', instructions: '' }])}>+ Add Medicine</Button>
            {meds.length>1 && <Button variant="ghost" className="text-xs" onClick={()=>setMeds(meds.slice(0,-1))}>Remove last</Button>}
          </div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(PrescriptionList)
