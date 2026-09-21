import Button from './Button'

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center gap-3 py-12 px-6 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-ink-100 dark:bg-white/10 flex items-center justify-center mb-1">
          <Icon className="w-5 h-5 text-ink-500" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-[15px] font-medium text-ink-900 dark:text-ink-50">{title}</h3>
      {description && (
        <p className="text-sm text-ink-500 max-w-xs leading-relaxed -mt-1">{description}</p>
      )}
      {actionLabel && (
        <Button onClick={onAction} size="sm" fullWidth={false} className="mt-2 px-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
