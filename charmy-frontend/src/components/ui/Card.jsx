export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-3xl shadow-sm
        border border-gray-100 dark:border-gray-800 p-4
        ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}