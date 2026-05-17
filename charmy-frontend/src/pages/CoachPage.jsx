import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSession } from '../api/conversations'
import { getRelation } from '../api/relations'
import { rateSuggestion } from '../api/conversations'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  SparklesIcon,
  ClipboardDocumentIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import { HandThumbUpIcon as HandThumbUpSolid } from '@heroicons/react/24/solid'

export default function CoachPage() {
  const { id } = useParams()
  const [input, setInput] = useState('')
  const [session, setSession] = useState(null)
  const [copied, setCopied] = useState(null)
  const [rated, setRated] = useState({})

  const { data: relation } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const sessionMutation = useMutation({
    mutationFn: () => createSession({ relation: id, raw_input: input }),
    onSuccess: (res) => setSession(res.data),
  })

  const rateMutation = useMutation({
    mutationFn: ({ suggId, rating, was_used }) =>
      rateSuggestion(suggId, { rating, was_used }),
    onSuccess: (res, { suggId }) =>
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

      {/* Zone de saisie */}
      <Card>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Colle le dernier message reçu ou la conversation :
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ex: "Salut, tu fais quoi ce soir ?" \n\nOu colle toute la conversation...`}
          rows={5}
          className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-800
            border-gray-200 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-charmy-400
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 resize-none text-sm transition"
        />
        <div className="mt-3">
          <Button
            onClick={() => sessionMutation.mutate()}
            loading={sessionMutation.isPending}
            disabled={!input.trim()}
          >
            <SparklesIcon className="w-4 h-4" />
            {sessionMutation.isPending ? 'Charmy réfléchit...' : 'Générer des suggestions'}
          </Button>
        </div>
      </Card>

      {/* Erreur */}
      {sessionMutation.isError && (
        <p className="text-sm text-red-500 text-center">
          Une erreur est survenue. Réessaie.
        </p>
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
            <Card key={sugg.id}>
              {/* Numéro */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-charmy-500 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {sugg.tone_used}
                </span>
              </div>

              {/* Message */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 mb-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {sugg.message_text}
                </p>
              </div>

              {/* Stratégie */}
              <p className="text-xs text-gray-400 italic mb-3 leading-relaxed">
                💡 {sugg.strategy_explanation}
              </p>

              {/* Actions */}
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
            </Card>
          ))}

          {/* Nouvelle analyse */}
          <Button
            variant="outline"
            onClick={() => { setSession(null); setInput('') }}
          >
            Nouvelle analyse
          </Button>
        </div>
      )}
    </div>
  )
}