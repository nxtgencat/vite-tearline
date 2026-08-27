import React, { useCallback, useMemo, useState } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import FilterPanel from '@/components/ui/FilterPanel'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import FileUpload from '@/components/ui/FileUpload'
import Input from '@/components/ui/Input'
import { usePatients, usePatientFilter } from '@/hooks/usePatients'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { searchLocation } from '@/services/osm'
import { embedUrl } from '@/services/osm'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'

const schema = yup.object({
  name: yup.string().required(),
  gender: yup.string().required(),
  age: yup.number().min(0).max(120).required(),
  mobile: yup.string().required(),
  email: yup.string().email().required(),
  bloodGroup: yup.string().required(),
  address: yup.string().required(),
  emergencyContact: yup.string().required(),
  insurance: yup.string().required(),
  medicalHistory: yup.string().required(),
})

type FormValues = yup.InferType<typeof schema>

function PatientList() {
  const { items, loading, create, update, remove } = usePatients()
  const { can } = usePermission()
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<string | null>(null)
  const [view, setView] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [mapQuery, setMapQuery] = useState('')
  const [mapResults, setMapResults] = useState<{ display_name: string; lat: string; lon: string }[]>([])
  const [selectedAddr, setSelectedAddr] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const pageSize = 5
  const filtered = usePatientFilter(items, debounced, status, sort)
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page])

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', gender: 'Male', age: 30, mobile: '', email: '', bloodGroup: 'O+', address: '', emergencyContact: '', insurance: '', medicalHistory: '' }
  })

  const onSearchMap = async () => {
    try { const res = await searchLocation(mapQuery); setMapResults(res.map(r => ({ display_name: r.display_name, lat: r.lat, lon: r.lon }))) } catch { toast.error('Map search failed') }
  }

  const openCreate = useCallback(() => {
    reset({ name: '', gender: 'Male', age: 30, mobile: '', email: '', bloodGroup: 'O+', address: '', emergencyContact: '', insurance: '', medicalHistory: '' })
    setEditing(null); setSelectedAddr(''); setPhotoUrl(null); setShowForm(true)
  }, [reset])

  const openEdit = useCallback((id: string) => {
    const p = items.find(x => x.id === id)
    if (!p) return
    reset({ name: p.name, gender: p.gender, age: p.age, mobile: p.mobile, email: p.email, bloodGroup: p.bloodGroup, address: p.address, emergencyContact: p.emergencyContact, insurance: p.insurance, medicalHistory: p.medicalHistory })
    setEditing(id); setSelectedAddr(p.address); setPhotoUrl(p.photo ?? null); setShowForm(true)
  }, [items, reset])

  const onSubmit = async (data: FormValues) => {
    const payload = { ...data, gender: data.gender as 'Male' | 'Female' | 'Other', address: selectedAddr || data.address, photo: photoUrl || '', status: 'Active' as const }
    try {
      if (editing) { await update(editing, payload as never); toast.success('Patient updated') }
      else { await create(payload as never); toast.success('Patient created') }
      setShowForm(false)
    } catch { toast.error('Save failed') }
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    await remove(confirmDel); toast.success('Deleted'); setConfirmDel(null)
  }

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name', render: (r: (typeof items)[0]) => <span className="font-medium">{r.name}</span> },
    { key: 'gender', header: 'Gender' },
    { key: 'age', header: 'Age' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'bloodGroup', header: 'Blood' },
    { key: 'status', header: 'Status', render: (r: (typeof items)[0]) => <Badge variant={r.status === 'Active' ? 'mint' : r.status === 'Critical' ? 'rose' : 'slate'}>{r.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (r: (typeof items)[0]) => (
      <div className="flex gap-1">
        <button onClick={() => setView(r.id)} className="w-7 h-7 rounded-md border border-line dark:border-linedark grid place-content-center hover:bg-ink/5"><FiEye className="w-3.5 h-3.5" /></button>
        {can('patients.edit') && <button onClick={() => openEdit(r.id)} className="w-7 h-7 rounded-md border border-line dark:border-linedark grid place-content-center hover:bg-ink/5"><FiEdit2 className="w-3.5 h-3.5" /></button>}
        {can('patients.delete') && <button onClick={() => setConfirmDel(r.id)} className="w-7 h-7 rounded-md border border-rose text-rose grid place-content-center hover:bg-rose/10"><FiTrash2 className="w-3.5 h-3.5" /></button>}
      </div>
    ) },
  ]

  const viewPatient = items.find(x => x.id === view)

  return (
    <div>
      <PageHeader title="Patients" subtitle="Manage patient registrations, search & filter" action={can('patients.create') ? <Button onClick={openCreate} className="w-full sm:w-auto justify-center">+ Add Patient</Button> : null} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 min-w-0"><SearchBar value={query} onChange={setQuery} placeholder="Search by name, email, mobile, ID…" /></div>
        <div className="flex gap-3 flex-wrap">
          <FilterPanel label="Status" value={status} options={[{ label: 'All', value: 'All' }, { label: 'Active', value: 'Active' }, { label: 'Critical', value: 'Critical' }, { label: 'Discharged', value: 'Discharged' }]} onChange={v => { setStatus(v); setPage(1) }} />
          <FilterPanel label="Sort" value={sort} options={[{ label: 'Recent', value: 'recent' }, { label: 'Name', value: 'name' }, { label: 'Age', value: 'age' }]} onChange={setSort} />
        </div>
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? <EmptyState title="No patients" hint="Try adjusting search or add a new patient" action={can('patients.create') ? <Button onClick={openCreate} className="w-full sm:w-auto justify-center">Add Patient</Button> : undefined} /> : (
        <>
          <Table columns={columns as never} data={paged as never} />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center mt-4">
            <p className="text-xs text-slate dark:text-slatedark">{filtered.length} total • page {page}/{totalPages}</p>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Patient' : 'Add Patient'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Name" {...register('name')} error={errors.name?.message} />
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Gender</span><select {...register('gender')} className="field"><option>Male</option><option>Female</option><option>Other</option></select></label>
            <Input label="Age" type="number" {...register('age')} error={errors.age?.message} />
            <Input label="Blood Group" {...register('bloodGroup')} error={errors.bloodGroup?.message} />
            <Input label="Mobile" {...register('mobile')} error={errors.mobile?.message} />
            <Input label="Email" {...register('email')} error={errors.email?.message} />
            <Input label="Emergency Contact" {...register('emergencyContact')} error={errors.emergencyContact?.message} />
            <Input label="Insurance" {...register('insurance')} error={errors.insurance?.message} />
          </div>
          <div>
            <label className="block"><span className="text-sm font-medium mb-1.5 block">Address (search via OSM)</span>
              <div className="flex flex-wrap gap-2">
                <input value={mapQuery} onChange={e => setMapQuery(e.target.value)} placeholder="Search location e.g. Delhi" className="field flex-1" />
                <Button type="button" variant="outline" onClick={onSearchMap}>Search</Button>
              </div>
            </label>
            {mapResults.length > 0 && (
              <div className="mt-2 rounded-lg border border-line dark:border-linedark divide-y divide-line dark:divide-linedark max-h-32 overflow-auto">
                {mapResults.map(r => (
                  <button type="button" key={r.display_name} onClick={() => { setSelectedAddr(r.display_name); setValue('address', r.display_name) }} className="w-full text-left px-3 py-2 text-xs hover:bg-ink/5 dark:hover:bg-white/5">{r.display_name}</button>
                ))}
              </div>
            )}
            <input type="hidden" {...register('address')} />
            {selectedAddr && <p className="text-xs mt-2 p-2 rounded-lg bg-cobalt/5 border border-cobalt/10">Selected: {selectedAddr}</p>}
            {selectedAddr && (
              <iframe title="map" src={embedUrl(Number(mapResults.find(r=>r.display_name===selectedAddr)?.lat || 28.6139), Number(mapResults.find(r=>r.display_name===selectedAddr)?.lon || 77.209))} className="w-full h-40 rounded-lg border border-line dark:border-linedark mt-2" loading="lazy" />
            )}
          </div>
          <label className="block"><span className="text-sm font-medium mb-1.5 block">Medical History</span><textarea {...register('medicalHistory')} className="field min-h-[70px]" /></label>
          <FileUpload label="Patient Photo" onUploaded={u => setPhotoUrl(u?.url ?? null)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title="Patient Details">
        {viewPatient && (
          <div className="space-y-3 text-sm">
            <div className="flex gap-4 items-start">
              {viewPatient.photo ? <img src={viewPatient.photo} alt={viewPatient.name} className="w-16 h-16 rounded-xl object-cover border border-line dark:border-linedark" /> : <div className="w-16 h-16 rounded-xl bg-ink/5 dark:bg-white/5 grid place-content-center text-xs">No Photo</div>}
              <div><p className="font-semibold text-base">{viewPatient.name}</p><p className="text-slate dark:text-slatedark">{viewPatient.id} • {viewPatient.gender} • {viewPatient.age}y • {viewPatient.bloodGroup}</p><Badge variant={viewPatient.status === 'Active' ? 'mint' : viewPatient.status === 'Critical' ? 'rose' : 'slate'}>{viewPatient.status}</Badge></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line dark:border-linedark">
              <p><span className="text-slate dark:text-slatedark">Mobile:</span> {viewPatient.mobile}</p>
              <p><span className="text-slate dark:text-slatedark">Email:</span> {viewPatient.email}</p>
              <p className="col-span-2"><span className="text-slate dark:text-slatedark">Address:</span> {viewPatient.address}</p>
              <p><span className="text-slate dark:text-slatedark">Emergency:</span> {viewPatient.emergencyContact}</p>
              <p><span className="text-slate dark:text-slatedark">Insurance:</span> {viewPatient.insurance}</p>
              <p className="col-span-2"><span className="text-slate dark:text-slatedark">History:</span> {viewPatient.medicalHistory}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmDel} onClose={() => setConfirmDel(null)} onConfirm={handleDelete} title="Delete patient" message="This will permanently delete the patient record." />
    </div>
  )
}

export default React.memo(PatientList)
