import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getRelations, getDashboardStats } from '../api/relations'
import { getMe } from '../api/auth'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  SparklesIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'

const RELATION_LABELS = {
  romantic: '💕',
  friendship: '👋',
  professional: '💼',
  family: '👨‍👩‍👧',
  reconciliation: '🕊️',
}

const HEALTH_COLOR = (score) => {
  if (score >= 70) return 'bg-green-400'
  if (score >= 40) return 'bg-yellow-400'
  return 'bg-red-400'
}

const HEALTH_LABEL = (score) => {
  if (score >= 70) return { text: 'Chaud 🔥', color: 'text-green-500' }
  if (score >= 40) return { text: 'Tiède 😐', color: 'text-yellow-500' }
  return { text: 'Froid 🧊', color: 'text-red-500' }
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className={`flex-1 bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-1`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then((r) => r.data),
  })

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats().then((r) => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['relations'],
    queryFn: () => getRelations().then((r) => r.data),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin text-4xl">💘</div>
    </div>
  )

  const relations = data?.results || data || []

  // Trier : dernière interaction d'abord
  const sorted = [...relations].sort((a, b) => {
    if (!a.last_interaction) return 1
    if (!b.last_interaction) return -1
    return new Date(b.last_interaction) - new Date(a.last_interaction)
  })

  const getTimeAgo = (date) => {
    if (!date) return null
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `il y a ${days}j`
    if (hours > 0) return `il y a ${hours}h`
    if (mins > 0) return `il y a ${mins}min`
    return "à l'instant"
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Greeting */}
      <div className="mt-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Bonjour {user?.username} 👋
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Prêt(e) à charmer aujourd'hui ?
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex gap-2">
          <StatCard
            icon={HeartIcon}
            value={stats.total_relations}
            label="Relations actives"
            color="bg-charmy-500"
          />
          <StatCard
            icon={ChatBubbleLeftRightIcon}
            value={stats.sessions_this_week}
            label="Sessions cette semaine"
            color="bg-blue-400"
          />
          <StatCard
            icon={SparklesIcon}
            value={stats.suggestions_used}
            label="Messages envoyés"
            color="bg-purple-400"
          />
        </div>
      )}

      {/* Relation la plus active */}
      {stats?.most_active_relation && (
        <div
          onClick={() => navigate(`/relations/${stats.most_active_relation.id}`)}
          className="bg-gradient-to-r from-charmy-500 to-pink-500 rounded-3xl p-4 cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium mb-0.5">
                🔥 Relation la plus active
              </p>
              <h3 className="text-white font-bold text-lg">
                {stats.most_active_relation.name}
              </h3>
              {stats.most_active_relation.last_interaction && (
                <p className="text-white/60 text-xs mt-0.5">
                  Dernière activité {getTimeAgo(stats.most_active_relation.last_interaction)}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
              {stats.most_active_relation.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Header liste */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Mes relations
        </h3>
        <button
          onClick={() => navigate('/relations/new')}
          className="bg-charmy-500 text-white p-2.5 rounded-xl shadow hover:bg-charmy-600 transition"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Liste des relations */}
      {relations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
          <span className="text-6xl">💌</span>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Aucune relation pour l'instant
          </h3>
          <p className="text-sm text-gray-400">
            Ajoute une personne et laisse Charmy t'aider
          </p>
          <Button onClick={() => navigate('/relations/new')} className="max-w-xs">
            Ajouter une relation
          </Button>
        </div>
      ) : (
        sorted.map((relation) => {
          const health = HEALTH_LABEL(relation.health_score)
          return (
            <Card
              key={relation.id}
              onClick={() => navigate(`/relations/${relation.id}`)}
            >
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-charmy-100 dark:bg-charmy-900 flex items-center justify-center text-xl font-bold text-charmy-500 shrink-0">
                  {relation.contact.name.charAt(0).toUpperCase()}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>{RELATION_LABELS[relation.relation_type]}</span>
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {relation.contact.name}
                      </h3>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ml-2 ${health.color}`}>
                      {health.text}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {relation.goal}
                  </p>

                  {/* Barre + temps */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${HEALTH_COLOR(relation.health_score)}`}
                        style={{ width: `${relation.health_score}%` }}
                      />
                    </div>
                    {relation.last_interaction && (
                      <span className="text-xs text-gray-300 dark:text-gray-600 shrink-0">
                        {getTimeAgo(relation.last_interaction)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bouton coach rapide */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/relations/${relation.id}/coach`)
                  }}
                  className="p-2.5 rounded-xl bg-charmy-50 dark:bg-charmy-950 hover:bg-charmy-100 transition shrink-0"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-charmy-500" />
                </button>
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}