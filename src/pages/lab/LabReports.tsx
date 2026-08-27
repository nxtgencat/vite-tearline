import React, { useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import FileUpload from '@/components/ui/FileUpload'
import Input from '@/components/ui/Input'
import { getStorage, setStorage } from '@/services/storage'
import { seedLabReports, type LabReport } from '@/services/mockData'
import { toast } from '@/components/ui/Sonner'
import { sendEmail } from '@/services/email'

const KEY = 'hms_lab'

function LabReports() {
  const [items, setItems] = useState<LabReport[]>(() => getStorage(KEY, seedLabReports))
  const [show, setShow] = useState(false)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({ patientName: '', test: '', status: 'Pending' as LabReport['status'] })
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const filtered = filter==='All' ? items : items.filter(i=>i.status===filter)

  const add = async () => {
    if (!form.patientName || !form.test) { toast.error('Patient and test required'); return }
    const next = [...items, { id: 'L'+Date.now(), ...form, date: new Date().toISOString(), fileName: fileName || undefined }]
    setStorage(KEY, next); setItems(next); setShow(false); toast.success('Test request added')
    if (fileUrl) await sendEmail('lab_ready', 'patient@example.com', { test: form.test })
  }

  const updateStatus = (id: string, status: LabReport['status']) => {
    const next = items.map(i=> i.id===id ? { ...i, status } : i)
    setStorage(KEY, next); setItems(next); toast.success('Status updated')
  }

  return (
    <div>
      <PageHeader title="Laboratory" subtitle="Test requests, reports, preview & download" action={<Button onClick={()=>setShow(true)} className="w-full sm:w-auto justify-center">+ New Test Request</Button>} />
      <div className="flex flex-wrap gap-2 mb-4">
        {['All','Pending','In Progress','Completed'].map(s=> <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm border ${filter===s ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark' : 'border-line dark:border-linedark'}`}>{s}</button>)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Card key={r.id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div><p className="font-medium text-sm">{r.test}</p><p className="text-xs text-slate dark:text-slatedark">{r.patientName} • {r.id}</p></div>
              <Badge variant={r.status==='Completed'?'mint':r.status==='Pending'?'amber':'cobalt'}>{r.status}</Badge>
            </div>
            <p className="text-xs text-slate dark:text-slatedark">{new Date(r.date).toLocaleDateString()}</p>
            {r.fileName && <p className="text-xs flex items-center gap-1">📄 {r.fileName}</p>}
            <div className="flex flex-wrap gap-2">
              {r.fileName && <Button variant="outline" className="text-xs py-1 flex-1" onClick={()=>setPreview(fileUrl || r.fileName || null)}>Preview</Button>}
              <select value={r.status} onChange={e=>updateStatus(r.id, e.target.value as never)} className="flex-1 px-2 py-1 rounded-lg border border-line dark:border-linedark text-xs">
                <option>Pending</option><option>In Progress</option><option>Completed</option>
              </select>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={show} onClose={()=>setShow(false)} title="New Lab Request">
        <div className="space-y-3">
          <Input label="Patient Name" value={form.patientName} onChange={e=>setForm({...form, patientName: e.target.value})} />
          <Input label="Test Name" value={form.test} onChange={e=>setForm({...form, test: e.target.value})} />
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Status</span>
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value as never})} className="field">
              <option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
          </label>
          <FileUpload label="Upload Report (PDF/Image)" onUploaded={u=>{ setFileUrl(u?.url ?? null); setFileName(u?.name ?? '') }} />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button onClick={add}>Save</Button></div>
        </div>
      </Modal>

      <Modal open={!!preview} onClose={()=>setPreview(null)} title="Report Preview">
        <div className="space-y-3">
          <p className="text-xs text-slate dark:text-slatedark">Preview before download — verify content.</p>
          {preview?.endsWith('.pdf') || fileName.endsWith('.pdf') ? (
            <div className="h-64 rounded-lg border border-line dark:border-linedark grid place-content-center bg-paper dark:bg-inkdark">
              <p className="text-sm">PDF Preview: {fileName || preview}</p>
              {fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="text-cobalt text-sm underline text-center block mt-2">Open PDF</a>}
            </div>
          ) : fileUrl ? <img src={fileUrl} alt="preview" className="w-full rounded-lg border border-line dark:border-linedark" /> : <p className="text-sm text-slate dark:text-slatedark">No file preview</p>}
          <div className="flex justify-end"><Button variant="outline" onClick={()=>{ if (fileUrl) { const a=document.createElement('a'); a.href=fileUrl; a.download=fileName||'report'; a.click() }}}>Download</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(LabReports)
