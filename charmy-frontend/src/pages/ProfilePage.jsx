import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { LogOut, Moon, Bell, ShieldCheck } from 'lucide-react'
import { getMe } from '../api/auth'
import useAuthStore from '../store/authStore'
import useTheme from '../hooks/useTheme'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import SectionHeader from '../components/ui/SectionHeader'
import Sheet from '../components/ui/Sheet'
import { Skeleton } from '../components/ui/Skeleton'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors
        ${checked ? 'bg-charmy-500' : 'bg-ink-200 dark:bg-white/15'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform
          ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { theme, toggle } = useTheme()
  const [showConfirm, setShowConfirm] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then((r) => r.data),
  })

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-ink-950 dark:text-ink-50">Profil</h1>
      </div>

      <Card className="flex items-center gap-4">
        <Avatar name={user?.username} src={user?.avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-ink-950 dark:text-ink-50 truncate">{user?.username}</h2>
          <p className="text-sm text-ink-500 truncate">{user?.email}</p>
          {user?.created_at && (
            <p className="text-xs text-ink-400 mt-1">
              Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-2.5">
        <SectionHeader title="Préférences" />
        <Card padding={false} className="divide-y divide-ink-100 dark:divide-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Moon className="w-4 h-4 text-ink-500 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-sm text-ink-800 dark:text-ink-200">Thème sombre</span>
            <Toggle checked={theme === 'dark'} onChange={toggle} label="Thème sombre" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Bell className="w-4 h-4 text-ink-500 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-sm text-ink-800 dark:text-ink-200">Notifications</span>
            <Toggle checked={notifications} onChange={() => setNotifications((n) => !n)} label="Notifications" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-2.5">
        <SectionHeader title="Compte" />
        <Card padding={false} className="overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <ShieldCheck className="w-4 h-4 text-ink-500 shrink-0" strokeWidth={1.75} />
            <p className="text-sm text-ink-800 dark:text-ink-200">
              Vos données restent privées et ne sont jamais partagées.
            </p>
          </div>
        </Card>
      </div>

      <Button variant="outline" onClick={() => setShowConfirm(true)} className="text-danger border-danger/25 hover:bg-danger-soft">
        <LogOut className="w-4 h-4" strokeWidth={1.75} />
        Se déconnecter
      </Button>

      <p className="text-xs text-ink-300 dark:text-ink-600 text-center">Charmy — 100% gratuit</p>

      <Sheet open={showConfirm} onClose={() => setShowConfirm(false)} title="Tu pars déjà ?">
        <p className="text-sm text-ink-500 -mt-2">Tu seras déconnecté(e) de Charmy.</p>
        <div className="flex flex-col gap-2 mt-1">
          <Button variant="danger" onClick={handleLogout}>Oui, me déconnecter</Button>
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>Annuler</Button>
        </div>
      </Sheet>
    </div>
  )
}
