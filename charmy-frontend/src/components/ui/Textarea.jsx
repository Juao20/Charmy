export default function Textarea({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-700 dark:text-ink-200">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3.5 rounded-2xl border bg-ink-50 dark:bg-white/5
          border-ink-200 dark:border-white/10
          focus:outline-none focus:ring-2 focus:ring-charmy-300 focus:border-charmy-300
          text-ink-950 dark:text-ink-50
          placeholder:text-ink-300 dark:placeholder:text-ink-500 resize-none text-[15px] leading-relaxed transition
          ${error ? 'border-danger focus:ring-danger/30 focus:border-danger' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
