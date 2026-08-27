import { useCallback, useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, listItems, updateItem } from '@/services/storage'
import { seedPatients, type Patient } from '@/services/mockData'
import { delay } from '@/services/api'

const KEY = 'hms_patients'

export function usePatients() {
  const [items, setItems] = useState<Patient[]>(() => listItems(KEY, seedPatients))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    try { await delay(400); setItems(listItems(KEY, seedPatients)) }
    catch (e: unknown) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (p: Omit<Patient, 'id' | 'createdAt'>) => {
    await delay(300)
    const newItem: Patient = { ...p, id: 'P' + String(Date.now()).slice(-6), createdAt: new Date().toISOString() }
    createItem(KEY, newItem); setItems(listItems(KEY, seedPatients)); return newItem
  }, [])

  const update = useCallback(async (id: string, patch: Partial<Patient>) => {
    await delay(300); updateItem(KEY, id, patch); setItems(listItems(KEY, seedPatients))
  }, [])

  const remove = useCallback(async (id: string) => {
    await delay(300); deleteItem(KEY, id); setItems(listItems(KEY, seedPatients))
  }, [])

  return { items, loading, error, refresh, create, update, remove }
}

export function usePatientFilter(items: Patient[], query: string, status: string, sort: string) {
  return useMemo(() => {
    let out = [...items]
    if (query) {
      const q = query.toLowerCase()
      out = out.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.mobile.includes(q) || p.id.toLowerCase().includes(q))
    }
    if (status && status !== 'All') out = out.filter(p => p.status === status)
    if (sort === 'name') out.sort((a,b)=>a.name.localeCompare(b.name))
    else if (sort === 'age') out.sort((a,b)=>a.age-b.age)
    else out.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
    return out
  }, [items, query, status, sort])
}
