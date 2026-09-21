import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Pencil, Trash2, Target, BookOpen as BookIcon, Brain, Plus, History } from 'lucide-react'
import { getRelation, getJournal, deleteRelation, createJournalEntry } from '../api/relations'
import { getSessionHistory } from '../api/conversations'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import HealthIndicator from '../components/ui/HealthIndicator'
import SectionHeader from '../components/ui/SectionHeader'
import Sheet from '../components/ui/Sheet'
import Textarea from '../components/ui/Textarea'
import { Skeleton } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'
import { RELATION_TYPE_MAP, TONE_MAP, EVENT_TYPES } from '../lib/relationLabels'
import JournalEntryItem from '../components/journal/JournalEntryItem'

export default function RelationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { show } = useToast()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showNoteSheet, setShowNoteSheet] = useState(false)
  const [note, setNote] = useState({ note: '', event_type: 'note' })

  const { data: relation, isLoading } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const { data: journal } = useQuery({
    queryKey: ['journal', id],
    queryFn: () => getJournal(id).then((r) => r.data),
  })

  const { data: historyData } = useQuery({
    queryKey: ['history', id],
    queryFn: () => getSessionHistory(id).then((r) => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteRelation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['relations'])
      show('Relation supprimée.')
      navigate('/relations')
    },
  })

  const noteMutation = useMutation({
    mutationFn: () => createJournalEntry(id, {
      ...note,
      event_date: new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['journal', id])
      queryClient.invalidateQueries(['journal-all'])
      show('Note ajoutée.')
      setShowNoteSheet(false)
      setNote({ note: '', event_type: 'note' })
    },
    onError: () => show("Impossible d'ajouter la note.", 'error'),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
      </div>
    )
  }

  if (!relation) return null

  const type = RELATION_TYPE_MAP[relation.relation_type]
  const entries = journal?.results || journal || []
  const sessions = historyData?.results || historyData || []

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={relation.contact.name} src={relation.contact.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl text-ink-950 dark:text-ink-50 truncate">
              {relation.contact.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <Badge tone="primary">{type?.label}</Badge>
              <Badge>{TONE_MAP[relation.tone]}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => navigate(`/relations/${id}/edit`)}
              aria-label="Modifier"
              className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-white/10 transition"
            >
              <Pencil className="w-4 h-4 text-ink-400" strokeWidth={1.75} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              aria-label="Supprimer"
              className="p-2 rounded-full hover:bg-danger-soft transition"
            >
              <Trash2 className="w-4 h-4 text-danger/70" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-white/10">
          <span className="text-xs font-medium text-ink-500">Santé de la relation</span>
          <HealthIndicator score={relation.health_score} showLabel />
        </div>
      </Card>

      {/* Vue d'ensemble */}
      <Card className="flex flex-col gap-3.5">
        <SectionHeader title="Vue d'ensemble" />
        <div className="flex items-start gap-3">
          <Target className="w-4 h-4 text-charmy-500 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <p className="text-xs text-ink-500 mb-0.5">Objectif</p>
            <p className="text-sm text-ink-800 dark:text-ink-200 leading-relaxed">{relation.goal}</p>
          </div>
        </div>
        {relation.strategy && (
          <div className="flex items-start gap-3 pt-3 border-t border-ink-100 dark:border-white/10">
            <Brain className="w-4 h-4 text-charmy-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-xs text-ink-500 mb-0.5">Stratégie</p>
              <p className="text-sm text-ink-800 dark:text-ink-200 leading-relaxed">{relation.strategy}</p>
            </div>
          </div>
        )}
        {relation.backstory && (
          <div className="flex items-start gap-3 pt-3 border-t border-ink-100 dark:border-white/10">
            <BookIcon className="w-4 h-4 text-charmy-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-xs text-ink-500 mb-0.5">Historique</p>
              <p className="text-sm text-ink-800 dark:text-ink-200 leading-relaxed">{relation.backstory}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button onClick={() => navigate(`/relations/${id}/coach`)}>
          <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
          Coach IA
        </Button>
        <Button variant="outline" onClick={() => setShowNoteSheet(true)}>
          <Plus className="w-4 h-4" strokeWidth={1.75} />
          Ajouter une note
        </Button>
      </div>

      {/* Journal */}
      <div className="flex flex-col gap-2.5">
        <SectionHeader title="Journal" subtitle={entries.length ? `${entries.length} entrée${entries.length > 1 ? 's' : ''}` : null} />
        {entries.length === 0 ? (
          <Card>
            <p className="text-sm text-ink-500 text-center py-1">Aucune note pour l'instant.</p>
          </Card>
        ) : (
          entries.slice(0, 3).map((entry) => (
            <JournalEntryItem key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {/* Coaching */}
      <div className="flex flex-col gap-2.5">
        <SectionHeader
          title="Coaching"
          subtitle={sessions.length ? `${sessions.length} session${sessions.length > 1 ? 's' : ''}` : null}
        />
        {sessions.length === 0 ? (
          <Card>
            <div className="flex items-center gap-3 py-1">
              <History className="w-4 h-4 text-ink-400 shrink-0" strokeWidth={1.75} />
              <p className="text-sm text-ink-500">Aucune session pour l'instant.</p>
            </div>
          </Card>
        ) : (
          sessions.slice(0, 3).map((session) => (
            <Card key={session.id}>
              <p className="text-xs text-ink-400">
                {new Date(session.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-ink-700 dark:text-ink-300 mt-1 line-clamp-2">
                {session.raw_input}
              </p>
              {session.context_summary && (
                <p className="text-xs text-charmy-500 mt-1.5 italic">{session.context_summary}</p>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modal confirmation suppression */}
      <Sheet open={showConfirm} onClose={() => setShowConfirm(false)} title="Supprimer cette relation ?">
        <p className="text-sm text-ink-500 -mt-2">
          Toutes les conversations et suggestions avec{' '}
          <span className="font-medium text-ink-800 dark:text-ink-200">{relation.contact.name}</span>{' '}
          seront perdues définitivement.
        </p>
        <div className="flex flex-col gap-2 mt-1">
          <Button variant="danger" onClick={() => deleteMutation.mutate()} loading={deleteMutation.isPending}>
            Oui, supprimer
          </Button>
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>Annuler</Button>
        </div>
      </Sheet>

      {/* Modal ajout note */}
      <Sheet open={showNoteSheet} onClose={() => setShowNoteSheet(false)} title="Nouvelle note">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            {EVENT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setNote({ ...note, event_type: value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${note.event_type === value
                    ? 'bg-charmy-500 border-charmy-500 text-white'
                    : 'border-ink-200 dark:border-white/15 text-ink-600 dark:text-ink-300'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Textarea
            rows={4}
            placeholder={`Qu'est-ce qui s'est passé avec ${relation.contact.name} ?`}
            value={note.note}
            onChange={(e) => setNote({ ...note, note: e.target.value })}
          />
          <Button
            onClick={() => noteMutation.mutate()}
            loading={noteMutation.isPending}
            disabled={!note.note.trim()}
          >
            Enregistrer
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
