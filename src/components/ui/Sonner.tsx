import React, { useCallback, useEffect, useState } from 'react'
import { FiCheckCircle, FiAlertCircle, FiBell, FiAlertTriangle, FiX } from 'react-icons/fi'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'default'
type Toast = { id: string; msg: string; variant: Variant; leaving: boolean }

let addFn: ((msg: string, variant?: Variant) => void) | null = null

export const toast = {
  success: (msg: string) => addFn?.(msg, 'success'),
  error: (msg: string) => addFn?.(msg, 'error'),
  warning: (msg: string) => addFn?.(msg, 'warning'),
  info: (msg: string) => addFn?.(msg, 'info'),
  // generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __call: (msg: string, _opts?: any) => addFn?.(msg, 'default'),
}

function getVariantStyles(v: Variant) {
  if (v === 'success') return 'border-mint/40 bg-mint/10 text-ink'
  if (v === 'error') return 'border-rose/30 bg-rose/10 text-ink'
  if (v === 'warning') return 'border-amber/30 bg-amber/10 text-ink'
  if (v === 'info') return 'border-cobalt/30 bg-cobalt/5 text-ink'
  return 'border-line bg-surface text-ink'
}

function getIcon(v: Variant) {
  if (v === 'success') return <FiCheckCircle className="w-4 h-4 text-mint shrink-0" />
  if (v === 'error') return <FiAlertCircle className="w-4 h-4 text-rose shrink-0" />
  if (v === 'warning') return <FiAlertTriangle className="w-4 h-4 text-amber shrink-0" />
  return <FiBell className="w-4 h-4 text-slate shrink-0" />
}

export function Sonner() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
  }, [])

  const push = useCallback((msg: string, variant: Variant = 'default') => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 6)
    const t: Toast = { id, msg, variant, leaving: false }
    setToasts(prev => [...prev, t].slice(-4))
    const timer = setTimeout(() => remove(id), 2600)
    return () => clearTimeout(timer)
  }, [remove])

  useEffect(() => {
    addFn = push
    return () => { addFn = null }
  }, [push])

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col-reverse gap-2 pointer-events-none w-[min(90vw,300px)]">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-lg border shadow-md text-sm flex items-center gap-2 ${getVariantStyles(t.variant)} ${t.leaving ? 'opacity-0 translate-x-5' : 'animate-[fadeUp_.5s_cubic-bezier(.16,1,.3,1)_both]'} transition-all duration-300`}
        >
          {getIcon(t.variant)}
          <span className="flex-1 leading-snug">{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="shrink-0 w-6 h-6 rounded-full grid place-content-center hover:bg-ink/5 transition-colors"
            aria-label="Close notification"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

// hook alternative for components that prefer hook
export function useToast() {
  return toast
}
