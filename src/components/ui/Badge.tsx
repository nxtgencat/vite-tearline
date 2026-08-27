import React from 'react'

type Props = { children: React.ReactNode; variant?: 'mint' | 'amber' | 'rose' | 'slate' | 'cobalt' }

function Badge({ children, variant = 'slate' }: Props) {
  const map: Record<string, string> = {
    mint: 'bg-mint/15 text-mint border border-mint/20',
    amber: 'bg-amber/15 text-amber border border-amber/20',
    rose: 'bg-rose/15 text-rose border border-rose/20',
    slate: 'bg-ink/5 dark:bg-white/10 text-slate dark:text-slatedark border border-line dark:border-linedark',
    cobalt: 'bg-cobalt/10 text-cobalt border border-cobalt/15',
  }
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium leading-none ${map[variant]}`}>{children}</span>
}

export default React.memo(Badge)
