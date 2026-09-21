import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle, Users } from 'lucide-react'
import { getRelations } from '../api/relations'
import RelationCard from '../components/relation/RelationCard'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'

export default function CoachEntryPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['relations'],
    queryFn: () => getRelations().then((r) => r.data),
  })

  const relations = data?.results || data || []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-charmy-50 dark:bg-charmy-950 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 text-charmy-500" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink-950 dark:text-ink-50">Coach IA</h1>
          <p className="text-sm text-ink-500 mt-0.5">Pour qui as-tu besoin d'aide ?</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonList count={3} />
      ) : relations.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucune relation à coacher pour l'instant."
          description="Ajoutez une relation pour lancer votre première session avec Charmy."
          actionLabel="Ajouter une relation"
          onAction={() => navigate('/relations/new')}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {relations.map((relation) => (
            <RelationCard
              key={relation.id}
              relation={relation}
              onClick={() => navigate(`/relations/${relation.id}/coach`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
