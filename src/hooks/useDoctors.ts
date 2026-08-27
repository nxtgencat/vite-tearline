import { useCallback, useEffect, useState } from 'react'
import { createItem, deleteItem, listItems, updateItem } from '@/services/storage'
import { seedDoctors, type Doctor } from '@/services/mockData'
import { delay } from '@/services/api'

const KEY = 'hms_doctors'

export function useDoctors() {
  const [items, setItems] = useState<Doctor[]>(() => listItems(KEY, seedDoctors))
  const [loading, setLoading] = useState(false)
  const sync = useCallback(async () => {
    setLoading(true); await delay(350); setItems(listItems(KEY, seedDoctors)); setLoading(false)
  }, [])
  useEffect(() => { sync() }, [sync])

  const create = useCallback(async (d: Omit<Doctor,'id'>) => {
    await delay(300); const n: Doctor = { ...d, id: 'D'+String(Date.now()).slice(-6)}; createItem(KEY, n); setItems(listItems(KEY, seedDoctors)); return n
  }, [])

  const update = useCallback(async (id: string, patch: Partial<Doctor>) => { await delay(300); updateItem(KEY, id, patch); setItems(listItems(KEY, seedDoctors)) }, [])
  const remove = useCallback(async (id: string) => { await delay(300); deleteItem(KEY, id); setItems(listItems(KEY, seedDoctors)) }, [])

  return { items, loading, create, update, remove, refresh: sync }
}
