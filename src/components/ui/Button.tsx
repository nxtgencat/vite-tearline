import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }

function Button({ variant = 'primary', loading, children, className = '', disabled, ...rest }: Props) {
  const base =
    variant === 'primary' ? 'btn-primary'
    : variant === 'secondary' ? 'btn-secondary'
    : variant === 'outline' ? 'btn-outline'
    : variant === 'ghost' ? 'btn-ghost'
    : 'btn-icon'
  return (
    <button className={`${base} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? 'Loading…' : children}
    </button>
  )
}

export default React.memo(Button)
