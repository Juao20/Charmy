import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700 dark:text-ink-200">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none px-4 py-3 pr-10 rounded-2xl border bg-ink-50 dark:bg-white/5
            border-ink-200 dark:border-white/10
            focus:outline-none focus:ring-2 focus:ring-charmy-300 focus:border-charmy-300
            text-ink-950 dark:text-ink-50 text-[15px] transition
            ${error ? 'border-danger focus:ring-danger/30 focus:border-danger' : ''}
            ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 text-ink-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
