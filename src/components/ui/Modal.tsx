import React, { useEffect } from 'react'

type Props = { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }

function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg sm:max-w-lg max-w-[95vw] sm:mx-auto rounded-xl bg-surface dark:bg-surfacedark shadow-lg border border-line dark:border-linedark max-h-[92vh] sm:max-h-[90vh] overflow-auto">
        {title && <div className="sticky top-0 bg-surface dark:bg-surfacedark px-4 sm:px-6 py-3 sm:py-4 border-b border-line dark:border-linedark flex justify-between items-center gap-4"><h3 className="font-display font-semibold text-base sm:text-lg truncate">{title}</h3><button onClick={onClose} className="btn-icon w-8 h-8 shrink-0">×</button></div>}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}

export default React.memo(Modal)
