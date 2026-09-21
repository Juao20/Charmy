import useTheme from '../../hooks/useTheme'
import { SunMedium, MoonStar } from 'lucide-react'

export default function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-20
      bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-white/10
      flex items-center justify-between px-5 h-14">
      <span className="font-display text-lg text-ink-950 dark:text-ink-50">Charmy</span>
      <button
        onClick={toggle}
        aria-label="Changer de thème"
        className="p-2 -mr-2 rounded-full hover:bg-ink-100 dark:hover:bg-white/10 transition"
      >
        {theme === 'dark'
          ? <SunMedium className="w-[18px] h-[18px] text-ink-300" strokeWidth={1.75} />
          : <MoonStar className="w-[18px] h-[18px] text-ink-500" strokeWidth={1.75} />
        }
      </button>
    </header>
  )
}
