import useTheme from '../../hooks/useTheme'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-10
      bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800
      flex items-center justify-between px-4 h-16">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💘</span>
        <span className="font-bold text-xl text-charmy-500">Charmy</span>
      </div>
      <button
        onClick={toggle}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {theme === 'dark'
          ? <SunIcon className="w-5 h-5 text-yellow-400" />
          : <MoonIcon className="w-5 h-5 text-gray-600" />
        }
      </button>
    </header>
  )
}