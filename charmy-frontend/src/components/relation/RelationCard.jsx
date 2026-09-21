import { ChevronRight, MessageCircle } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { RELATION_TYPE_MAP, getTimeAgo } from '../../lib/relationLabels'

export default function RelationCard({ relation, onClick, onCoachClick }) {
  const type = RELATION_TYPE_MAP[relation.relation_type]
  const Icon = type?.icon

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-white dark:bg-ink-900 rounded-3xl border border-ink-100 dark:border-white/10
        p-3.5 cursor-pointer hover:border-ink-200 dark:hover:border-white/20 transition-colors"
    >
      <Avatar name={relation.contact.name} src={relation.contact.avatar} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-ink-400 shrink-0" strokeWidth={1.75} />}
          <h3 className="font-medium text-ink-950 dark:text-ink-50 truncate">
            {relation.contact.name}
          </h3>
        </div>
        <p className="text-xs text-ink-500 truncate mt-0.5">
          {type?.label}
          {relation.last_interaction && ` · ${getTimeAgo(relation.last_interaction)}`}
        </p>
      </div>

      {onCoachClick && (
        <button
          onClick={(e) => { e.stopPropagation(); onCoachClick() }}
          aria-label={`Lancer une session coaching avec ${relation.contact.name}`}
          className="p-2.5 rounded-xl bg-ink-50 dark:bg-white/5 hover:bg-charmy-50 dark:hover:bg-charmy-950 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-ink-500 group-hover:text-charmy-500" strokeWidth={1.75} />
        </button>
      )}
      <ChevronRight className="w-4 h-4 text-ink-300 shrink-0" strokeWidth={1.75} />
    </div>
  )
}
