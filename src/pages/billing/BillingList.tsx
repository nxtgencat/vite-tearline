import React, { useState, useMemo } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { getStorage, setStorage } from '@/services/storage'
import { seedBilling, type Billing } from '@/services/mockData'
import { formatCurrency } from '@/utils/format'
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/export'
import { toast } from 'react-toastify'
import { sendEmail } from '@/services/email'

const KEY = 'hms_billing'

function BillingList() {
  const [items, setItems] = useState<Billing[]>(() => getStorage(KEY, seedBilling))
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ patientName: '', type: 'Consultation', amount: 1000, discount: 0, tax: 10 })

  const total = useMemo(() => form.amount - form.discount + (form.amount * form.tax / 100), [form])

  const add = async () => {
    const billing: Billing = { id: 'B'+Date.now(), patientName: form.patientName || 'Unknown', type: form.type, amount: form.amount, discount: form.discount, tax: form.tax, total, status: 'Pending', date: new Date().toISOString() }
    const next = [...items, billing]; setStorage(KEY, next); setItems(next); setShow(false); toast.success('Invoice created'); await sendEmail('billing', 'patient@example.com', { id: billing.id, total: String(total) })
  }

  const markPaid = (id: string) => {
    const next = items.map(i=> i.id===id ? { ...i, status: 'Paid' as const } : i); setStorage(KEY, next); setItems(next); toast.success('Marked paid')
  }

  const exportAll = (kind: 'csv'|'pdf'|'excel') => {
    const rows = items.map(i=>({ ID: i.id, Patient: i.patientName, Type: i.type, Amount: i.amount, Discount: i.discount, Tax: i.tax, Total: i.total, Status: i.status, Date: i.date }))
    if (kind==='csv') exportToCSV(rows, 'billing.csv')
    else if (kind==='excel') exportToExcel(rows, 'billing.xls')
    else exportToPDF('Billing Report', rows, 'billing.pdf')
    toast.success(`Exported ${kind}`)
  }

  const columns = [
    { key: 'id', header: 'Invoice' },
    { key: 'patientName', header: 'Patient' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount', render: (r: Billing)=> formatCurrency(r.amount) },
    { key: 'discount', header: 'Discount', render: (r: Billing)=> formatCurrency(r.discount) },
    { key: 'tax', header: 'Tax %', render: (r: Billing)=> `${r.tax}%` },
    { key: 'total', header: 'Total', render: (r: Billing)=> <span className="font-semibold">{formatCurrency(r.total)}</span> },
    { key: 'status', header: 'Status', render: (r: Billing)=> <Badge variant={r.status==='Paid'?'mint':r.status==='Pending'?'amber':'rose'}>{r.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (r: Billing)=> r.status!=='Paid' ? <button onClick={()=>markPaid(r.id)} className="px-2 py-1 rounded-full border border-mint text-mint text-xs">Mark Paid</button> : <span className="text-xs text-slate dark:text-slatedark">—</span> },
  ]

  return (
    <div>
      <PageHeader title="Billing & Payments" subtitle="Consultation, lab, pharmacy charges with discounts & taxes" action={<div className="flex flex-wrap gap-2"><Button variant="outline" className="text-xs px-3 py-1.5" onClick={()=>exportAll('csv')}>CSV</Button><Button variant="outline" className="text-xs px-3 py-1.5" onClick={()=>exportAll('excel')}>Excel</Button><Button variant="outline" className="text-xs px-3 py-1.5" onClick={()=>exportAll('pdf')}>PDF</Button><Button onClick={()=>setShow(true)} className="w-full sm:w-auto justify-center">+ Create Invoice</Button></div>} />
      <Table columns={columns as never} data={items as never} />
      <div className="mt-4 p-4 rounded-xl bg-cobalt/5 border border-cobalt/10 flex justify-between text-sm">
        <span>Total Revenue</span><span className="font-semibold">{formatCurrency(items.reduce((s,i)=>s+i.total,0))}</span>
      </div>

      <Modal open={show} onClose={()=>setShow(false)} title="Create Invoice">
        <div className="space-y-3">
          <Input label="Patient Name" value={form.patientName} onChange={e=>setForm({...form, patientName: e.target.value})} />
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Type</span>
            <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="field">
              <option>Consultation</option><option>Laboratory</option><option>Pharmacy</option>
            </select>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Amount" type="number" value={String(form.amount)} onChange={e=>setForm({...form, amount: Number(e.target.value)})} />
            <Input label="Discount" type="number" value={String(form.discount)} onChange={e=>setForm({...form, discount: Number(e.target.value)})} />
            <Input label="Tax %" type="number" value={String(form.tax)} onChange={e=>setForm({...form, tax: Number(e.target.value)})} />
          </div>
          <div className="p-3 rounded-lg bg-paper dark:bg-inkdark border border-line dark:border-linedark text-sm flex justify-between">
            <span>Total Payable</span><span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button onClick={add}>Create</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(BillingList)
