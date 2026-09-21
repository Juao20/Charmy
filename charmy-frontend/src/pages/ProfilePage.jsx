import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth'
import useAuthStore from '../store/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then((r) => r.data),
  })

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin text-4xl">💘</div>
    </div>
  )

  const menuItems = [
    {
      icon: BellIcon,
      label: 'Notifications',
      sublabel: 'Rappels et alertes',
      onClick: () => {},
    },
    {
      icon: ShieldCheckIcon,
      label: 'Confidentialité',
      sublabel: 'Tes données sont protégées',
      onClick: () => {},
    },
    {
      icon: QuestionMarkCircleIcon,
      label: 'Aide & Support',
      sublabel: 'FAQ et contact',
      onClick: () => {},
    },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Header profil */}
      <Card>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-charmy-400 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {user?.username}
            </h2>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Membre depuis */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 text-center">
            Membre depuis le{' '}
            {new Date(user?.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </Card>

      {/* Menu items */}
      <Card className="p-0 overflow-hidden">
        {menuItems.map(({ icon: Icon, label, sublabel, onClick }, index) => (
          <button
            key={label}
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left
              ${index !== menuItems.length - 1
                ? 'border-b border-gray-100 dark:border-gray-800'
                : ''
              }`}
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
              <p className="text-xs text-gray-400">{sublabel}</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
        ))}
      </Card>

      {/* Version */}
      <p className="text-xs text-gray-300 dark:text-gray-600 text-center">
        Charmy v1.0.0 — Fait avec 💘
      </p>

      {/* Bouton logout */}
      <Button
        variant="outline"
        onClick={() => setShowConfirm(true)}
        className="border-red-200 text-red-400 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Se déconnecter
      </Button>

      {/* Modal confirmation logout */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-4 pb-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="text-center">
              <div className="text-4xl mb-3">👋</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Tu pars déjà ?
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Tu seras déconnecté(e) de Charmy.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              Oui, me déconnecter
            </Button>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}