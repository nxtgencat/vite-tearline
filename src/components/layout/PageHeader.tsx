import React from 'react'

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display font-semibold text-2xl md:text-3xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate dark:text-slatedark mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default React.memo(PageHeader)
