export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  className = '',
  disabled = false,
}) {
  const base = 'w-full py-3 px-4 rounded-2xl font-semibold text-sm transition duration-200 flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-charmy-500 hover:bg-charmy-600 text-white disabled:opacity-50',
    outline: 'border-2 border-charmy-500 text-charmy-500 hover:bg-charmy-50 dark:hover:bg-charmy-950 bg-transparent',
    ghost: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 bg-transparent',
    white: 'bg-white text-charmy-500 hover:bg-charmy-50 font-bold',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}