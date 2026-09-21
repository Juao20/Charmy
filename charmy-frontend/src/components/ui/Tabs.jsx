export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex bg-ink-100 dark:bg-white/5 rounded-2xl p-1 gap-1 ${className}`} role="tablist">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition
            ${active === key
              ? 'bg-white dark:bg-ink-800 text-ink-950 dark:text-ink-50 shadow-soft'
              : 'text-ink-500 hover:text-ink-700 dark:hover:text-ink-200'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
