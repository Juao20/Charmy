import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, Users } from 'lucide-react'
import { getRelations } from '../api/relations'
import RelationCard from '../components/relation/RelationCard'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'
import { RELATION_TYPES } from '../lib/relationLabels'

export default function RelationsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['relations'],
    queryFn: () => getRelations().then((r) => r.data),
  })

  const relations = data?.results || data || []

  const filtered = relations.filter((r) => {
    const matchesQuery = r.contact.name.toLowerCase().includes(query.trim().toLowerCase())
    const matchesType = !typeFilter || r.relation_type === typeFilter
    return matchesQuery && matchesType
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink-950 dark:text-ink-50">Relations</h1>
          <p className="text-sm text-ink-500 mt-1">
            Gardez une vue claire sur les personnes qui comptent.
          </p>
        </div>
        <button
          onClick={() => navigate('/relations/new')}
          aria-label="Nouvelle relation"
          className="p-2.5 rounded-xl bg-charmy-500 hover:bg-charmy-600 text-white transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une personne..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border bg-ink-50 dark:bg-white/5
            border-ink-200 dark:border-white/10
            focus:outline-none focus:ring-2 focus:ring-charmy-300 focus:border-charmy-300
            text-ink-950 dark:text-ink-50 placeholder:text-ink-400 text-sm transition"
        />
      </div>

      {relations.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          <Chip selected={!typeFilter} onClick={() => setTypeFilter(null)}>Tous</Chip>
          {RELATION_TYPES.map(({ value, label }) => (
            <Chip key={value} selected={typeFilter === value} onClick={() => setTypeFilter(value)}>
              {label}
            </Chip>
          ))}
        </div>
      )}

      {isLoading ? (
        <SkeletonList count={4} />
      ) : relations.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Vous n'avez encore aucune relation."
          description="Ajoutez votre première relation pour commencer."
          actionLabel="Ajouter une relation"
          onAction={() => navigate('/relations/new')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Aucun résultat"
          description="Essayez un autre nom ou filtre."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((relation) => (
            <RelationCard
              key={relation.id}
              relation={relation}
              onClick={() => navigate(`/relations/${relation.id}`)}
              onCoachClick={() => navigate(`/relations/${relation.id}/coach`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
