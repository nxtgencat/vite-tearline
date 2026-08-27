import React from 'react'

type Props = { children: React.ReactNode; variant?: 'mint' | 'amber' | 'rose' | 'slate' | 'cobalt' }

function Badge({ children, variant = 'slate' }: Props) {
  const map: Record<string, string> = {
    mint: 'bg-mint/15 text-mint',
    amber: 'bg-amber/15 text-amber',
    rose: 'bg-rose/15 text-rose',
    slate: 'bg-ink/5 dark:bg-white/10 text-slate dark:text-slatedark',
    cobalt: 'bg-cobalt/10 text-cobalt',
  }
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${map[variant]}`}>{children}</span>
}

export default React.memo(Badge)
