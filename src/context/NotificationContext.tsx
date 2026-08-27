import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getStorage, setStorage } from '@/services/storage'
import { seedNotifications, type Notification } from '@/services/mockData'

type Ctx = {
  notifications: Notification[]
  unread: number
  add: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
}

export const NotificationContext = createContext<Ctx | null>(null)

const KEY = 'hms_notifications'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = getStorage<Notification[] | null>(KEY, null)
    if (!stored) { setStorage(KEY, seedNotifications); return seedNotifications }
    return stored
  })

  useEffect(() => { setStorage(KEY, notifications) }, [notifications])

  const add = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const item: Notification = { id: 'N' + Date.now(), createdAt: new Date().toISOString(), read: false, ...n }
    setNotifications(prev => [item, ...prev])
  }, [])

  const markRead = useCallback((id: string) => setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x)), [])
  const markAllRead = useCallback(() => setNotifications(prev => prev.map(x => ({ ...x, read: true }))), [])
  const remove = useCallback((id: string) => setNotifications(prev => prev.filter(x => x.id !== id)), [])

  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const value = useMemo(() => ({ notifications, unread, add, markRead, markAllRead, remove }), [notifications, unread, add, markRead, markAllRead, remove])
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
