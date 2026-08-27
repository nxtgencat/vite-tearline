import React from 'react'
import Button from './Button'

type Props = { page: number; totalPages: number; onChange: (p: number) => void }

function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" className="px-3 py-1.5 text-xs" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map(p => (
        <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-md text-sm ${p === page ? 'bg-ink dark:bg-paperdark text-paper dark:text-inkdark' : 'hover:bg-ink/5 dark:hover:bg-white/5'}`}>{p}</button>
      ))}
      <Button variant="outline" className="px-3 py-1.5 text-xs" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  )
}

export default React.memo(Pagination)
