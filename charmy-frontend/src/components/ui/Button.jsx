export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charmy-400'

  const sizes = {
    sm: 'text-sm py-2 px-3.5',
    md: 'text-sm py-3 px-5',
    lg: 'text-[15px] py-3.5 px-6',
  }

  const variants = {
    primary: 'bg-charmy-500 hover:bg-charmy-600 text-white shadow-soft',
    secondary: 'bg-ink-100 hover:bg-ink-200 text-ink-900 dark:bg-white/10 dark:hover:bg-white/15 dark:text-ink-50',
    outline: 'border border-ink-200 dark:border-white/15 text-ink-900 dark:text-ink-50 hover:bg-ink-50 dark:hover:bg-white/5 bg-transparent',
    ghost: 'text-ink-500 hover:bg-ink-100 dark:hover:bg-white/10 bg-transparent',
    danger: 'bg-danger hover:bg-danger/90 text-white',
  }

  const full = props.fullWidth === false ? '' : 'w-full'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full} ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}
