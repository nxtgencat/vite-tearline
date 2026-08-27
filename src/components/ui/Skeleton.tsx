import React from 'react'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg animate-[shimmer_1.6s_infinite_linear] ${className}`} />
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default React.memo(Skeleton)
