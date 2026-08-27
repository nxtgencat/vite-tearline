import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

function Input({ label, error, className = '', ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium mb-1.5 block">{label}</span>}
      <input className={`field ${error ? '!border-rose' : ''} ${className}`} {...rest} />
      {error && <span className="text-xs text-rose mt-1 block">{error}</span>}
    </label>
  )
}

export default React.memo(Input)
