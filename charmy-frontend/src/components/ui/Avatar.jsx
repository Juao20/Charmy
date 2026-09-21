const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-xl',
}

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${SIZES[size]} rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${SIZES[size]} rounded-full bg-charmy-50 dark:bg-charmy-950
        flex items-center justify-center font-display font-medium text-charmy-600 dark:text-charmy-300
        shrink-0 ${className}`}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
