export default function Chip({ children, selected = false, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-colors shrink-0
        ${selected
          ? 'bg-charmy-500 border-charmy-500 text-white'
          : 'bg-transparent border-ink-200 dark:border-white/15 text-ink-700 dark:text-ink-200 hover:border-ink-300 dark:hover:border-white/25'
        }
        ${className}`}
    >
      {children}
    </button>
  )
}
