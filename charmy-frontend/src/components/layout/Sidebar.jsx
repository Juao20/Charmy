import { NavLink } from 'react-router-dom'
import { Home, Users, MessageCircle, BookOpen, User } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import { SunMedium, MoonStar } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/relations', label: 'Relations', icon: Users },
  { to: '/coach', label: 'Coach IA', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
]

export default function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-ink-100 dark:border-white/10 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="font-display text-xl text-ink-950 dark:text-ink-50">Charmy</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300'
                : 'text-ink-500 hover:bg-ink-50 dark:hover:bg-white/5 hover:text-ink-900 dark:hover:text-ink-100'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1 pt-4 border-t border-ink-100 dark:border-white/10">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
            ${isActive
              ? 'bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300'
              : 'text-ink-500 hover:bg-ink-50 dark:hover:bg-white/5 hover:text-ink-900 dark:hover:text-ink-100'
            }`
          }
        >
          <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
          Profil
        </NavLink>
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-500
            hover:bg-ink-50 dark:hover:bg-white/5 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
        >
          {theme === 'dark'
            ? <SunMedium className="w-[18px] h-[18px]" strokeWidth={1.75} />
            : <MoonStar className="w-[18px] h-[18px]" strokeWidth={1.75} />
          }
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>
    </aside>
  )
}
