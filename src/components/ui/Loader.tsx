import React from 'react'

function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 justify-center text-slate dark:text-slatedark">
      <span className="w-5 h-5 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default React.memo(Loader)
