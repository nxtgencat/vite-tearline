import { useCallback, useEffect, useState } from 'react'
import { createItem, listItems, updateItem } from '@/services/storage'
import { seedAppointments, type Appointment } from '@/services/mockData'
import { delay } from '@/services/api'

const KEY = 'hms_appointments'

export function useAppointments() {
  const [items, setItems] = useState<Appointment[]>(() => listItems(KEY, seedAppointments))
  const [loading, setLoading] = useState(false)
  const sync = useCallback(async () => { setLoading(true); await delay(350); setItems(listItems(KEY, seedAppointments)); setLoading(false)}, [])
  useEffect(() => { sync() }, [sync])

  const create = useCallback(async (a: Omit<Appointment,'id'>) => {
    await delay(400); const n: Appointment = { ...a, id: 'A'+String(Date.now()).slice(-6)}; createItem(KEY, n); setItems(listItems(KEY, seedAppointments)); return n
  }, [])

  const updateStatus = useCallback(async (id: string, status: Appointment['status']) => {
    await delay(300); updateItem<Appointment>(KEY, id, { status } as Partial<Appointment>); setItems(listItems(KEY, seedAppointments))
  }, [])

  return { items, loading, create, updateStatus, refresh: sync }
}
