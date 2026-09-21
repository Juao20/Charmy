import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, BookOpen } from 'lucide-react'
import { getAllJournalEntries, createJournalEntryGlobal, getRelations } from '../api/relations'
import JournalEntryItem from '../components/journal/JournalEntryItem'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'
import Sheet from '../components/ui/Sheet'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toast'
import { EVENT_TYPES } from '../lib/relationLabels'

export default function JournalPage() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { show } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['journal-all'],
    queryFn: () => getAllJournalEntries().then((r) => r.data),
  })

  const { data: relationsData } = useQuery({
    queryKey: ['relations'],
    queryFn: () => getRelations().then((r) => r.data),
  })

  const entries = data?.results || data || []
  const relations = relationsData?.results || relationsData || []

  const [form, setForm] = useState({ relation_id: '', event_type: 'note', note: '', event_date: '' })

  const createMutation = useMutation({
    mutationFn: () => createJournalEntryGlobal({
      ...form,
      event_date: form.event_date || new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['journal-all'])
      show('Note ajoutée au journal.')
      setOpen(false)
      setForm({ relation_id: '', event_type: 'note', note: '', event_date: '' })
    },
    onError: () => show('Impossible d\'ajouter la note. Réessaie.', 'error'),
  })

  const openSheet = () => {
    if (relations.length === 0) {
      show('Ajoute une relation avant de créer une note de journal.', 'info')
      return
    }
    setForm((f) => ({ ...f, relation_id: relations[0].id }))
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink-950 dark:text-ink-50">Journal</h1>
          <p className="text-sm text-ink-500 mt-1">
            Vos notes personnelles, à l'abri du regard des autres.
          </p>
        </div>
        <button
          onClick={openSheet}
          aria-label="Ajouter une note"
          className="p-2.5 rounded-xl bg-charmy-500 hover:bg-charmy-600 text-white transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {isLoading ? (
        <SkeletonList count={4} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Votre journal est vide."
          description="Notez une étape, un conflit ou un moment positif pour garder une trace de vos relations."
          actionLabel="Ajouter une note"
          onAction={openSheet}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <JournalEntryItem key={entry.id} entry={entry} showRelation />
          ))}
        </div>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title="Nouvelle note">
        <div className="flex flex-col gap-4">
          <Select
            label="Relation"
            value={form.relation_id}
            onChange={(e) => setForm({ ...form, relation_id: e.target.value })}
          >
            {relations.map((r) => (
              <option key={r.id} value={r.id}>{r.contact.name}</option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Type</label>
            <div className="flex gap-2 flex-wrap">
              {EVENT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, event_type: value })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                    ${form.event_type === value
                      ? 'bg-charmy-500 border-charmy-500 text-white'
                      : 'border-ink-200 dark:border-white/15 text-ink-600 dark:text-ink-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Note"
            rows={4}
            placeholder="Qu'est-ce qui s'est passé ?"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <Button
            onClick={() => createMutation.mutate()}
            loading={createMutation.isPending}
            disabled={!form.note.trim() || !form.relation_id}
          >
            Enregistrer
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
