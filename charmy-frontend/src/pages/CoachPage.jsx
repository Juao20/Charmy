import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSession, getUsageStatus } from '../api/conversations'
import { getRelation } from '../api/relations'
import { rateSuggestion } from '../api/conversations'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  SparklesIcon,
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid'

export default function CoachPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [session, setSession] = useState(null)
  const [copied, setCopied] = useState(null)
  const [rated, setRated] = useState({})

  const { data: relation } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const { data: usage, refetch: refetchUsage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => getUsageStatus().then((r) => r.data),
  })

  const sessionMutation = useMutation({
    mutationFn: () => createSession({ relation: id, raw_input: input }),
    onSuccess: (res) => {
      setSession(res.data)
      refetchUsage()
    },
  })

  const rateMutation = useMutation({
    mutationFn: ({ suggId, rating, was_used }) =>
      rateSuggestion(suggId, { rating, was_used }),
    onSuccess: (_, { suggId }) =>
      setRated((r) => ({ ...r, [suggId]: true })),
  })

  const handleCopy = (text, suggId) => {
    navigator.clipboard.writeText(text)
    setCopied(suggId)
    setTimeout(() => setCopied(null), 2000)
    rateMutation.mutate({ suggId, was_used: true })
  }

  const handleRate = (suggId) => {
    rateMutation.mutate({ suggId, rating: 5, was_used: false })
  }

  const isLimitReached = !usage?.is_premium &&
    !usage?.suggestions_credits > 0 &&
    usage?.sessions_remaining === 0

  const suggestions = session?.suggestions || []

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Coach IA 🤖
        </h2>
        {relation && (
          <p className="text-sm text-gray-400 mt-0.5">
            Pour ta relation avec{' '}
            <span className="text-charmy-500 font-medium">
              {relation.contact.name}
            </span>
          </p>
        )}
      </div>

      {/* Compteur sessions — mode gratuit */}
      {usage && !usage.is_premium && (
        <div className={`rounded-2xl px-4 py-3 flex items-center justify-between
          ${isLimitReached
            ? 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
            : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
          }`}>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {usage.suggestions_credits > 0
                ? `💳 ${usage.suggestions_credits} crédits restants`
                : isLimitReached
                ? '⛔ Limite quotidienne atteinte'
                : `🔄 ${usage.sessions_remaining}/${usage.daily_limit} sessions restantes aujourd'hui`
              }
            </p>
            {isLimitReached && (
              <p className="text-xs text-red-400 mt-0.5">
                Reviens demain ou passe en Premium
              </p>
            )}
          </div>
          {isLimitReached && (
            <button
              onClick={() => navigate('/premium')}
              className="bg-charmy-500 text-white text-xs font-bold px-3 py-2 rounded-xl shrink-0 ml-3"
            >
              Premium ✨
            </button>
          )}
        </div>
      )}

      {/* Zone de saisie */}
      <Card>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Colle le dernier message reçu ou la conversation :
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLimitReached}
          placeholder={
            isLimitReached
              ? 'Limite atteinte — reviens demain ou passe en Premium'
              : 'Ex: "Salut, tu fais quoi ce soir ?" \n\nOu colle toute la conversation...'
          }
          rows={5}
          className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-800
            border-gray-200 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-charmy-400
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 resize-none text-sm transition
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="mt-3">
          <Button
            onClick={() => sessionMutation.mutate()}
            loading={sessionMutation.isPending}
            disabled={!input.trim() || isLimitReached}
          >
            <SparklesIcon className="w-4 h-4" />
            {sessionMutation.isPending ? 'Charmy réfléchit...' : 'Générer des suggestions'}
          </Button>
        </div>
      </Card>

      {/* Erreur limite */}
      {sessionMutation.error?.response?.data?.error === 'limit_reached' && (
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-500 font-medium text-center">
            ⛔ Limite quotidienne atteinte
          </p>
          <p className="text-xs text-red-400 text-center mt-1">
            Reviens demain ou passe en Premium pour des suggestions illimitées
          </p>
          <Button
            onClick={() => navigate('/premium')}
            className="mt-3 bg-charmy-500"
          >
            Passer en Premium ✨
          </Button>
        </Card>
      )}

      {/* Résultats */}
      {session && (
        <div className="flex flex-col gap-3">

          {/* Résumé contexte */}
          {session.context_summary && (
            <div className="bg-charmy-50 dark:bg-charmy-950 rounded-2xl p-4 border border-charmy-100 dark:border-charmy-900">
              <p className="text-xs font-semibold text-charmy-500 mb-1">
                🔍 Analyse de Charmy
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {session.context_summary}
              </p>
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-1">
            3 suggestions pour toi
          </h3>

          {suggestions.map((sugg, index) => (
            <Card key={sugg.id} className={sugg.is_locked ? 'relative overflow-hidden' : ''}>

              {/* Numéro + ton */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center
                  ${sugg.is_locked ? 'bg-gray-400' : 'bg-charmy-500'}`}>
                  {index + 1}
                </div>
                <span className="text-xs text-gray-400 font-medium flex-1">
                  {sugg.tone_used}
                </span>
                {sugg.is_premium_only && (
                  <span className="text-xs bg-yellow-50 dark:bg-yellow-950 text-yellow-500 px-2 py-0.5 rounded-full font-medium">
                    ⭐ Meilleur
                  </span>
                )}
              </div>

              {/* Contenu — flouté si locked */}
              <div className={`relative ${sugg.is_locked ? '' : ''}`}>
                <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 mb-3
                  ${sugg.is_locked ? 'select-none' : ''}`}>
                  {sugg.is_locked ? (
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed blur-sm select-none">
                      Ce message premium est le plus efficace dans ce contexte et sera parfait pour atteindre ton objectif avec cette personne.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {sugg.message_text}
                    </p>
                  )}
                </div>

                {!sugg.is_locked && (
                  <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">
                    💡 {sugg.strategy_explanation}
                  </p>
                )}

                {/* Overlay premium */}
                {sugg.is_locked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-2xl backdrop-blur-sm">
                    <LockClosedIcon className="w-6 h-6 text-charmy-500 mb-2" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Message Premium
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1 px-4">
                      C'est le plus optimisé des 3
                    </p>
                    <button
                      onClick={() => navigate('/premium')}
                      className="mt-3 bg-charmy-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-charmy-600 transition"
                    >
                      Débloquer ✨
                    </button>
                  </div>
                )}
              </div>

              {/* Actions — seulement si pas locked */}
              {!sugg.is_locked && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sugg.message_text, sugg.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition
                      ${copied === sugg.id
                        ? 'bg-green-50 text-green-500 dark:bg-green-950'
                        : 'bg-charmy-50 text-charmy-500 hover:bg-charmy-100 dark:bg-charmy-950 dark:hover:bg-charmy-900'
                      }`}
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    {copied === sugg.id ? 'Copié !' : 'Copier'}
                  </button>
                  <button
                    onClick={() => handleRate(sugg.id)}
                    disabled={rated[sugg.id]}
                    className={`p-2 rounded-xl transition
                      ${rated[sugg.id]
                        ? 'bg-yellow-50 text-yellow-500 dark:bg-yellow-950'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800'
                      }`}
                  >
                    {rated[sugg.id]
                      ? <HandThumbUpSolid className="w-5 h-5" />
                      : <HandThumbUpIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
              )}
            </Card>
          ))}

          <Button variant="outline" onClick={() => { setSession(null); setInput('') }}>
            Nouvelle analyse
          </Button>
        </div>
      )}
    </div>
  )
}