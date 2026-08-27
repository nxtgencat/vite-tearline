import React from 'react'

type Option = { label: string; value: string }
type Props = { label: string; value: string; options: Option[]; onChange: (v: string) => void }

function FilterPanel({ label, value, options, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate dark:text-slatedark">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="px-3 py-2 rounded-lg border border-line dark:border-linedark bg-surface dark:bg-surfacedark text-sm">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

export default React.memo(FilterPanel)
