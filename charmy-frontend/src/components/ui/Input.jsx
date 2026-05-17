export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-900
          border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-charmy-400
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 transition
          ${error ? 'border-red-400 focus:ring-red-300' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}