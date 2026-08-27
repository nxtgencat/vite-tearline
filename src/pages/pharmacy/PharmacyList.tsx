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
import { toast } from 'react-toastify'

const KEY = 'hms_medicines'

function PharmacyList() {
  const [items, setItems] = useState<Medicine[]>(() => getStorage(KEY, seedMedicines))
  const [query, setQuery] = useState('')
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: 'Analgesic', stock: 10, supplier: '', price: 10, expiry: '2027-01-01' })

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
      <PageHeader title="Pharmacy" subtitle="Medicine CRUD, stock, categories & suppliers" action={<Button onClick={()=>{ setForm({ name: '', category: 'Analgesic', stock: 10, supplier: '', price: 10, expiry: '2027-01-01' }); setEditing(null); setShow(true)}}>+ Add Medicine</Button>} />
      {lowStock.length>0 && <div className="mb-4 p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose">⚠ Low stock alert: {lowStock.map(m=>m.name).join(', ')} — reorder soon</div>}
      <div className="mb-4 max-w-sm"><SearchBar value={query} onChange={setQuery} placeholder="Search medicines…" /></div>
      <Table columns={columns as never} data={filtered as never} />

      <Modal open={show} onClose={()=>setShow(false)} title={editing?'Edit Medicine':'Add Medicine'}>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
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
