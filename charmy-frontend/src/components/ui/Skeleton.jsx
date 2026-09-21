export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-ink-100 dark:bg-white/10 rounded-xl animate-pulse-soft ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-3xl border border-ink-100 dark:border-white/10 p-4 flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-full shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
