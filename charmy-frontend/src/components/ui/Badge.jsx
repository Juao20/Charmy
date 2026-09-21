const TONES = {
  neutral: 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200',
  primary: 'bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
