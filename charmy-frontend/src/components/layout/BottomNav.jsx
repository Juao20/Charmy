import { NavLink } from 'react-router-dom'
import { Home, Users, MessageCircle, BookOpen, User } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/relations', label: 'Relations', icon: Users },
  { to: '/coach', label: 'Coach', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/profile', label: 'Profil', icon: User },
]

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-20
        bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-t border-ink-100 dark:border-white/10
        flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]"
    >
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center justify-center gap-1 py-2.5 flex-1 min-w-0"
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`w-5 h-5 ${isActive ? 'text-charmy-500' : 'text-ink-400'}`}
                strokeWidth={isActive ? 2 : 1.75}
              />
              <span className={`text-[10.5px] font-medium ${isActive ? 'text-charmy-500' : 'text-ink-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
