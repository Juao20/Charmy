export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div>
        <h2 className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">{title}</h2>
        {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
