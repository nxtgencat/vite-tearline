import React, { useContext, useState, useMemo } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { NotificationContext } from '@/context/NotificationContext'
import { timeAgo } from '@/utils/format'

function NotificationCenter() {
  const ctx = useContext(NotificationContext)
  const [filter, setFilter] = useState('all')
  if (!ctx) return null
  const { notifications, markRead, markAllRead, remove } = ctx

  const filtered = useMemo(() => {
    if (filter==='unread') return notifications.filter(n=>!n.read)
    if (filter==='appointment' || filter==='billing' || filter==='lab' || filter==='prescription') return notifications.filter(n=>n.type===filter)
    return notifications
  }, [notifications, filter])

  return (
    <div>
      <PageHeader title="Notifications" subtitle="New appointment, cancelled, billing, prescription, lab" action={<Button variant="outline" onClick={markAllRead}>Mark all read</Button>} />
      <div className="flex flex-wrap gap-2 mb-4">
        {['all','unread','appointment','billing','lab','prescription'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs border capitalize ${filter===f ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark' : 'border-line dark:border-linedark'}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(n=>(
          <div key={n.id} className={`p-4 rounded-xl border flex gap-3 ${n.read ? 'bg-surface dark:bg-surfacedark border-line dark:border-linedark' : 'bg-cobalt/5 border-cobalt/20'}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-slate' : 'bg-cobalt'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{n.title}</p>
                <Badge variant={n.type==='appointment'?'cobalt':n.type==='billing'?'amber':n.type==='lab'?'mint':'slate'}>{n.type}</Badge>
                {!n.read && <Badge variant="rose">New</Badge>}
              </div>
              <p className="text-sm text-slate dark:text-slatedark mt-1">{n.message}</p>
              <p className="text-xs text-slate dark:text-slatedark mt-2">{timeAgo(n.createdAt)}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {!n.read && <button onClick={()=>markRead(n.id)} className="px-2 py-1 rounded-full border border-line dark:border-linedark text-xs">Mark read</button>}
              <button onClick={()=>remove(n.id)} className="px-2 py-1 rounded-full border border-rose text-rose text-xs">Delete</button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <p className="text-sm text-center py-10 text-slate dark:text-slatedark">No notifications</p>}
      </div>
    </div>
  )
}

export default React.memo(NotificationCenter)
