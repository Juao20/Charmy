import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid'

const links = [
  {
    to: '/',
    label: 'Accueil',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: UserIcon,
    activeIcon: UserIconSolid,
  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto
      bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800
      flex items-center justify-around h-16 z-10">
      {links.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition
            ${isActive
              ? 'text-charmy-500'
              : 'text-gray-400 dark:text-gray-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive
                ? <ActiveIcon className="w-6 h-6" />
                : <Icon className="w-6 h-6" />
              }
              <span className="text-xs font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}