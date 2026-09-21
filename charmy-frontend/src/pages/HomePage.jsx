import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, ArrowRight, Users, CalendarDays, Sparkles } from 'lucide-react'
import { getRelations, getDashboardStats } from '../api/relations'
import { getMe } from '../api/auth'
import RelationCard from '../components/relation/RelationCard'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonList } from '../components/ui/Skeleton'

function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 py-3">
      <Icon className="w-4 h-4 text-ink-400 mb-0.5" strokeWidth={1.75} />
      <span className="text-lg font-semibold text-ink-900 dark:text-ink-50 font-display">{value ?? 0}</span>
      <span className="text-[11px] text-ink-500 text-center leading-tight">{label}</span>
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

  const relations = data?.results || data || []
  const recent = [...relations]
    .sort((a, b) => {
      if (!a.last_interaction) return 1
      if (!b.last_interaction) return -1
      return new Date(b.last_interaction) - new Date(a.last_interaction)
    })
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-ink-950 dark:text-ink-50">
          Bonjour{user?.username ? `, ${user.username}` : ''}
        </h1>
        <p className="text-sm text-ink-500 mt-1">Prenons soin de vos relations.</p>
      </div>

      {/* Coach IA — hero */}
      <div
        onClick={() => navigate('/coach')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/coach')}
        className="rounded-3xl bg-ink-950 dark:bg-white/5 border border-ink-950 dark:border-white/10 p-5 cursor-pointer
          hover:bg-ink-900 dark:hover:bg-white/[0.07] transition-colors group"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-charmy-500/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-[18px] h-[18px] text-charmy-300" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg text-white">Coach IA</h2>
            <p className="text-sm text-white/60 mt-1 leading-relaxed">
              Besoin d'aide pour répondre ? Analysez une conversation et trouvez le bon message.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-charmy-300 group-hover:gap-2.5 transition-all">
          Commencer une session
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </div>
      </div>

      {/* Relations récentes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Vos relations</h2>
          {relations.length > 0 && (
            <button
              onClick={() => navigate('/relations')}
              className="text-xs font-medium text-charmy-500 hover:text-charmy-600 flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-3 h-3" strokeWidth={2} />
            </button>
          )}
        </div>

        {isLoading ? (
          <SkeletonList count={2} />
        ) : relations.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Vous n'avez encore aucune relation."
            description="Ajoutez votre première relation pour commencer."
            actionLabel="Ajouter une relation"
            onAction={() => navigate('/relations/new')}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {recent.map((relation) => (
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

      {/* Stats — secondaires */}
      {stats && relations.length > 0 && (
        <div className="flex items-stretch divide-x divide-ink-100 dark:divide-white/10 border border-ink-100 dark:border-white/10 rounded-3xl">
          <StatItem icon={Users} value={stats.total_relations} label="Relations actives" />
          <StatItem icon={CalendarDays} value={stats.sessions_this_week} label="Sessions cette semaine" />
          <StatItem icon={Sparkles} value={stats.suggestions_used} label="Messages suggérés" />
        </div>
      )}
    </div>
  )
}
