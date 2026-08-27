import React, { useMemo, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import SearchBar from '@/components/ui/SearchBar'
import { getStorage, setStorage } from '@/services/storage'
import { seedMedicines, type Medicine } from '@/services/mockData'
import { toast } from '@/components/ui/Sonner'

const KEY = 'hms_medicines'
const PKEY = 'hms_purchases'
type Purchase = { id: string; medicine: string; supplier: string; qty: number; amount: number; date: string }
const seedPurchases: Purchase[] = [
  { id: 'PU001', medicine: 'Paracetamol 500mg', supplier: 'Sun Pharma', qty: 100, amount: 1200, date: new Date().toISOString().slice(0,10) },
  { id: 'PU002', medicine: 'Amoxicillin 250mg', supplier: 'Cipla', qty: 50, amount: 2250, date: new Date(Date.now()-86400000).toISOString().slice(0,10) },
]

function PharmacyList() {
  const [items, setItems] = useState<Medicine[]>(() => getStorage(KEY, seedMedicines))
  const [purchases] = useState<Purchase[]>(() => getStorage(PKEY, seedPurchases))
  const [query, setQuery] = useState('')
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: 'Analgesic', stock: 10, supplier: '', price: 10, expiry: '2027-01-01' })
  const [tab, setTab] = useState<'stock' | 'purchases'>('stock')

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(m=> m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.supplier.toLowerCase().includes(q))
  }, [items, query])

  const lowStock = useMemo(()=> filtered.filter(m=> m.stock < 10), [filtered])

  const save = () => {
    if (!form.name) { toast.error('Name required'); return }
    let next: Medicine[]
    if (editing) next = items.map(i=> i.id===editing ? { ...i, ...form } : i)
    else next = [...items, { id: 'M'+Date.now(), ...form }]
    setStorage(KEY, next); setItems(next); setShow(false); setEditing(null); toast.success('Saved')
  }

  const remove = (id: string) => { const next = items.filter(i=>i.id!==id); setStorage(KEY, next); setItems(next); toast.success('Deleted') }

  const openEdit = (m: Medicine) => { setForm({ name: m.name, category: m.category, stock: m.stock, supplier: m.supplier, price: m.price, expiry: m.expiry }); setEditing(m.id); setShow(true) }

  const columns = [
    { key: 'name', header: 'Medicine', render: (r: Medicine)=> <span className="font-medium">{r.name}</span> },
    { key: 'category', header: 'Category' },
    { key: 'stock', header: 'Stock', render: (r: Medicine)=> <Badge variant={r.stock<10?'rose': r.stock<30?'amber':'mint'}>{r.stock} units</Badge> },
    { key: 'supplier', header: 'Supplier' },
    { key: 'price', header: 'Price', render: (r: Medicine)=> `₹${r.price}` },
    { key: 'expiry', header: 'Expiry' },
    { key: 'actions', header: 'Actions', render: (r: Medicine)=> <div className="flex gap-1"><button onClick={()=>openEdit(r)} className="px-2 py-1 rounded-full border border-line dark:border-linedark text-xs">Edit</button><button onClick={()=>remove(r.id)} className="px-2 py-1 rounded-full border border-rose text-rose text-xs">Delete</button></div> },
  ]

  return (
    <div>
      <PageHeader title="Pharmacy" subtitle="Medicine CRUD, stock, categories, supplier & purchase history" action={<Button className="w-full sm:w-auto justify-center" onClick={()=>{ setForm({ name: '', category: 'Analgesic', stock: 10, supplier: '', price: 10, expiry: '2027-01-01' }); setEditing(null); setShow(true)}}>+ Add Medicine</Button>} />
      {lowStock.length>0 && <div className="mb-4 p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose">⚠ Low stock alert: {lowStock.map(m=>m.name).join(', ')} — reorder soon</div>}
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setTab('stock')} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border ${tab==='stock' ? 'bg-ink text-paper border-ink' : 'border-line'}`}>Stock Management</button>
        <button onClick={()=>setTab('purchases')} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm border ${tab==='purchases' ? 'bg-ink text-paper border-ink' : 'border-line'}`}>Purchase History</button>
      </div>
      {tab==='stock' ? (
        <>
          <div className="mb-4 w-full sm:max-w-sm"><SearchBar value={query} onChange={setQuery} placeholder="Search medicines…" /></div>
          <Table columns={columns as never} data={filtered as never} />
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-cobalt/5 border border-cobalt/10 text-center"><p className="text-xs text-slate">Total Purchases</p><p className="text-lg font-semibold">{purchases.length}</p></div>
            <div className="p-3 rounded-lg bg-mint/5 border border-mint/10 text-center"><p className="text-xs text-slate">Total Spent</p><p className="text-lg font-semibold">₹{purchases.reduce((s,p)=>s+p.amount,0)}</p></div>
            <div className="p-3 rounded-lg bg-amber/5 border border-amber/10 text-center"><p className="text-xs text-slate">Suppliers</p><p className="text-lg font-semibold">{new Set(purchases.map(p=>p.supplier)).size}</p></div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-paper text-left"><tr className="text-slate"><th className="px-3 sm:px-4 py-2">Medicine</th><th className="px-3 py-2">Supplier</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Date</th></tr></thead>
              <tbody className="divide-y divide-line bg-surface">
                {purchases.map(p=> <tr key={p.id}><td className="px-3 sm:px-4 py-2 font-medium">{p.medicine}</td><td className="px-3 py-2">{p.supplier}</td><td className="px-3 py-2">{p.qty}</td><td className="px-3 py-2">₹{p.amount}</td><td className="px-3 py-2">{p.date}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={show} onClose={()=>setShow(false)} title={editing?'Edit Medicine':'Add Medicine'}>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Category</span>
              <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="field">
                <option>Analgesic</option><option>Antibiotic</option><option>Cardiac</option><option>Antihistamine</option><option>Diabetic</option>
              </select>
            </label>
            <Input label="Stock" type="number" value={String(form.stock)} onChange={e=>setForm({...form, stock: Number(e.target.value)})} />
            <Input label="Supplier" value={form.supplier} onChange={e=>setForm({...form, supplier: e.target.value})} />
            <Input label="Price (₹)" type="number" value={String(form.price)} onChange={e=>setForm({...form, price: Number(e.target.value)})} />
            <Input label="Expiry" type="date" value={form.expiry} onChange={e=>setForm({...form, expiry: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={()=>setShow(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default React.memo(PharmacyList)
