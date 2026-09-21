export default function Card({ children, className = '', onClick, padding = true, style }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white dark:bg-ink-900 rounded-3xl
        border border-ink-100 dark:border-white/10
        ${padding ? 'p-4' : ''}
        ${onClick ? 'cursor-pointer hover:border-ink-200 dark:hover:border-white/20 transition-colors' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
