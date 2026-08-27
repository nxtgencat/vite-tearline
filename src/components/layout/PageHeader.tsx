import React from 'react'

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate dark:text-slatedark mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2 sm:justify-end w-full sm:w-auto">{action}</div>}
    </div>
  )
}

export default React.memo(PageHeader)
