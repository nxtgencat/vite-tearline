import React from 'react'
import { FiSearch } from 'react-icons/fi'

type Props = { value: string; onChange: (v: string) => void; placeholder?: string }

function SearchBar({ value, onChange, placeholder = 'Search…' }: Props) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate dark:text-slatedark" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="field pl-9" />
    </div>
  )
}

export default React.memo(SearchBar)
