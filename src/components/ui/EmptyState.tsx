import React from 'react'
import { FiInbox } from 'react-icons/fi'

function EmptyState({ title = 'No data', hint, action }: { title?: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="py-12 text-center border border-dashed border-line dark:border-linedark rounded-xl">
      <div className="w-10 h-10 rounded-full bg-ink/5 dark:bg-white/5 grid place-content-center mx-auto mb-3"><FiInbox className="w-4 h-4 text-slate dark:text-slatedark" /></div>
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="text-xs text-slate dark:text-slatedark mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default React.memo(EmptyState)
