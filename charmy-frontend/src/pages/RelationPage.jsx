import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRelation, getJournal, deleteRelation } from '../api/relations'
import { getSessionHistory, getUsageStatus } from '../api/conversations'  // ← ajoute
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  HeartIcon,
  TrashIcon,
  PencilIcon,
  LockClosedIcon,  // ← ajoute
} from '@heroicons/react/24/outline'

const RELATION_LABELS = {
  romantic: '💕 Amour',
  friendship: '👋 Amitié',
  professional: '💼 Pro',
  family: '👨‍👩‍👧 Famille',
  reconciliation: '🕊️ Réconciliation',
}

const TONE_LABELS = {
  playful: '😄 Joueur',
  tender: '🥰 Tendre',
  direct: '💬 Direct',
  formal: '👔 Formel',
  flirty: '😏 Flirty',
}

const HEALTH_COLOR = (score) => {
  if (score >= 70) return 'text-green-500'
  if (score >= 40) return 'text-yellow-500'
  return 'text-red-500'
}

const EVENT_LABELS = {
  milestone: '🏆 Étape',
  conflict: '⚡ Conflit',
  positive: '✨ Positif',
  note: '📝 Note',
}

export default function RelationPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: relation, isLoading } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const { data: journal } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => getJournal(id).then((r) => r.data),
  })

  const queryClient = useQueryClient()
  const [showConfirm, setShowConfirm] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => deleteRelation(id),
    onSuccess: () => {
        queryClient.invalidateQueries(['relations'])
        navigate('/')
    },
  })
  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => getUsageStatus().then((r) => r.data),
  })
  const { data: historyData, isError: historyLocked } = useQuery({
    queryKey: ['history', id],
    queryFn: () => getSessionHistory(id).then((r) => r.data),
    retry: false,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin text-4xl">💘</div>
    </div>
  )

  if (!relation) return null

  const entries = journal?.results || journal || []

  return (
    <div className="flex flex-col gap-4">

        {/* Header contact */}
        <Card>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-charmy-100 dark:bg-charmy-900 flex items-center justify-center text-2xl font-bold text-charmy-500">
            {relation.contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {relation.contact.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs bg-charmy-50 dark:bg-charmy-900 text-charmy-500 px-2 py-1 rounded-full">
                {RELATION_LABELS[relation.relation_type]}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">
                {TONE_LABELS[relation.tone]}
                </span>
            </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
            <button
                onClick={() => navigate(`/relations/${id}/edit`)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
                <PencilIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button
                onClick={() => setShowConfirm(true)}
                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition"
            >
                <TrashIcon className="w-5 h-5 text-red-400" />
            </button>
            </div>
        </div>

        {/* Health score */}
        <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Santé de la relation</span>
            <span className={`text-sm font-bold ${HEALTH_COLOR(relation.health_score)}`}>
                {relation.health_score}/100
            </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all ${
                relation.health_score >= 70
                    ? 'bg-green-400'
                    : relation.health_score >= 40
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${relation.health_score}%` }}
            />
            </div>
        </div>
        </Card>

        {/* Modal confirmation suppression */}
        {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-4 pb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="text-center">
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Supprimer cette relation ?
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                Toutes les conversations et suggestions avec{' '}
                <span className="font-medium text-charmy-500">
                    {relation.contact.name}
                </span>{' '}
                seront perdues.
                </p>
            </div>
            <Button
                onClick={() => deleteMutation.mutate()}
                loading={deleteMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
            >
                Oui, supprimer
            </Button>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Annuler
            </Button>
            </div>
        </div>
        )}

      {/* Objectif */}
      <Card>
        <div className="flex items-start gap-3">
          <HeartIcon className="w-5 h-5 text-charmy-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 mb-1">Objectif</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{relation.goal}</p>
          </div>
        </div>
        {relation.backstory && (
          <div className="flex items-start gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <BookOpenIcon className="w-5 h-5 text-charmy-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Historique</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{relation.backstory}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Bouton Coach IA — le plus important */}
      <button
        onClick={() => navigate(`/relations/${id}/coach`)}
        className="w-full bg-gradient-to-r from-charmy-500 to-pink-500
          text-white py-4 rounded-3xl font-bold text-base shadow-lg
          hover:shadow-charmy-200 hover:scale-[1.02] transition-all duration-200
          flex items-center justify-center gap-3"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        Obtenir des suggestions IA
      </button>

      {/* Journal */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1 flex items-center gap-2">
          Historique des sessions
          {!usage?.is_premium && (
            <span className="text-xs bg-yellow-50 dark:bg-yellow-950 text-yellow-500 px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </h3>

        {historyLocked ? (
          <Card className="relative overflow-hidden">
            {/* Preview floutée */}
            <div className="blur-sm pointer-events-none select-none flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-2" />
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl">
              <LockClosedIcon className="w-6 h-6 text-charmy-500 mb-2" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Historique Premium
              </p>
              <p className="text-xs text-gray-400 text-center mt-1 px-6">
                Retrouve toutes tes sessions passées et suis tes progrès
              </p>
              <button
                onClick={() => navigate('/premium')}
                className="mt-3 bg-charmy-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Débloquer ✨
              </button>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {(historyData?.results || historyData || []).length === 0 ? (
              <Card>
                <p className="text-sm text-gray-400 text-center py-2">
                  Aucune session pour l'instant
                </p>
              </Card>
            ) : (
              (historyData?.results || historyData || []).map((session) => (
                <Card key={session.id}>
                  <p className="text-xs text-gray-400">
                    {new Date(session.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                    {session.raw_input}
                  </p>
                  {session.context_summary && (
                    <p className="text-xs text-charmy-500 mt-1 italic">
                      {session.context_summary}
                    </p>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}