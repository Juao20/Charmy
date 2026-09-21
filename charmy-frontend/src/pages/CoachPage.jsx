import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Sparkles, RotateCcw } from 'lucide-react'
import { createSession, rateSuggestion } from '../api/conversations'
import { getRelation } from '../api/relations'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import Textarea from '../components/ui/Textarea'
import Avatar from '../components/ui/Avatar'
import MessageSuggestion from '../components/coach/MessageSuggestion'
import { useToast } from '../components/ui/Toast'
import { OBJECTIVES } from '../lib/relationLabels'

export default function CoachPage() {
  const { id } = useParams()
  const { show } = useToast()
  const [input, setInput] = useState('')
  const [objective, setObjective] = useState(null)
  const [session, setSession] = useState(null)
  const [rated, setRated] = useState({})

  const { data: relation } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const sessionMutation = useMutation({
    mutationFn: () => createSession({
      relation: id,
      raw_input: objective ? `[Objectif : ${objective}]\n\n${input}` : input,
    }),
    onSuccess: (res) => setSession(res.data),
  })

  const rateMutation = useMutation({
    mutationFn: ({ suggId, rating, was_used }) => rateSuggestion(suggId, { rating, was_used }),
    onSuccess: (_, { suggId }) => setRated((r) => ({ ...r, [suggId]: true })),
  })

  const handleCopy = (text, suggId) => {
    navigator.clipboard.writeText(text)
    show('Message copié.')
    rateMutation.mutate({ suggId, was_used: true })
  }

  const handleRate = (suggId) => rateMutation.mutate({ suggId, rating: 5, was_used: false })

  const reset = () => {
    setSession(null)
    setInput('')
    setObjective(null)
  }

  const suggestions = session?.suggestions || []

  return (
    <div className="flex flex-col gap-5">

      {/* Relation coachée */}
      {relation && (
        <div className="flex items-center gap-3">
          <Avatar name={relation.contact.name} src={relation.contact.avatar} size="sm" />
          <div>
            <p className="text-xs text-ink-500">Coaching avec</p>
            <p className="font-display text-lg text-ink-950 dark:text-ink-50 -mt-0.5">
              {relation.contact.name}
            </p>
          </div>
        </div>
      )}

      {!session && !sessionMutation.isPending && (
        <>
          <Card className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-ink-800 dark:text-ink-200 mb-2">
                Décrivez la situation
              </p>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Collez ici votre conversation ou décrivez la situation..."
                rows={6}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-ink-800 dark:text-ink-200 mb-2">
                Votre objectif <span className="text-ink-400 font-normal">(optionnel)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map((o) => (
                  <Chip key={o} selected={objective === o} onClick={() => setObjective(objective === o ? null : o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
          </Card>

          <Button
            onClick={() => sessionMutation.mutate()}
            disabled={!input.trim()}
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            Analyser la situation
          </Button>

          {sessionMutation.isError && (
            <p className="text-sm text-danger text-center -mt-2">
              {sessionMutation.error?.response?.data?.error || 'Une erreur est survenue. Réessaie.'}
            </p>
          )}
        </>
      )}

      {sessionMutation.isPending && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-charmy-100 dark:border-charmy-950" />
            <div className="absolute inset-0 rounded-full border-2 border-charmy-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300 animate-pulse-soft">
            Charmy analyse la situation...
          </p>
        </div>
      )}

      {session && (
        <div className="flex flex-col gap-3">
          {session.context_summary && (
            <div className="bg-charmy-50 dark:bg-charmy-950 rounded-2xl p-4 border border-charmy-100 dark:border-charmy-900">
              <p className="text-xs font-semibold text-charmy-600 dark:text-charmy-300 mb-1">
                Analyse de Charmy
              </p>
              <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
                {session.context_summary}
              </p>
            </div>
          )}

          {suggestions.map((sugg, index) => (
            <MessageSuggestion
              key={sugg.id}
              suggestion={sugg}
              index={index}
              onCopy={handleCopy}
              onRate={handleRate}
              rated={rated[sugg.id]}
            />
          ))}

          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            Nouvelle analyse
          </Button>
        </div>
      )}
    </div>
  )
}
