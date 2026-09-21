import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { EVENT_TYPE_MAP } from '../../lib/relationLabels'

export default function JournalEntryItem({ entry, showRelation = false }) {
  const type = EVENT_TYPE_MAP[entry.event_type] || EVENT_TYPE_MAP.note
  const Icon = type.icon

  return (
    <Card className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-ink-100 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-ink-500" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge tone={type.tone}>{type.label}</Badge>
            {showRelation && entry.relation_name && (
              <span className="text-xs text-ink-500">{entry.relation_name}</span>
            )}
          </div>
          <span className="text-xs text-ink-400">
            {new Date(entry.event_date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
        <p className="text-sm text-ink-700 dark:text-ink-300 mt-2 leading-relaxed">
          {entry.note}
        </p>
      </div>
    </Card>
  )
}
