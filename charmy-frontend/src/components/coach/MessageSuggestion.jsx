import { useState } from 'react'
import { Copy, Check, ThumbsUp } from 'lucide-react'
import Card from '../ui/Card'

const LABELS = ['Option 1', 'Option 2', 'Option 3']

export default function MessageSuggestion({ suggestion, index, onCopy, onRate, rated }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy(suggestion.message_text, suggestion.id)
  }

  return (
    <Card className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-charmy-500">
          {LABELS[index] || `Option ${index + 1}`}
        </span>
        <span className="text-xs text-ink-500">{suggestion.tone_used}</span>
      </div>

      <p className="text-[15px] text-ink-900 dark:text-ink-50 leading-relaxed">
        {suggestion.message_text}
      </p>

      {suggestion.strategy_explanation && (
        <div className="pt-3 border-t border-ink-100 dark:border-white/10">
          <p className="text-xs font-medium text-ink-500 mb-1">Pourquoi ça fonctionne</p>
          <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            {suggestion.strategy_explanation}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors
            ${copied
              ? 'bg-success-soft text-success'
              : 'bg-charmy-50 text-charmy-600 hover:bg-charmy-100 dark:bg-charmy-950 dark:text-charmy-300 dark:hover:bg-charmy-900'
            }`}
        >
          {copied ? <Check className="w-4 h-4" strokeWidth={2} /> : <Copy className="w-4 h-4" strokeWidth={1.75} />}
          {copied ? 'Copié' : 'Copier'}
        </button>
        <button
          onClick={() => onRate(suggestion.id)}
          disabled={rated}
          aria-label="Marquer comme utilisé"
          className={`p-2.5 rounded-xl transition-colors
            ${rated
              ? 'bg-warning-soft text-warning'
              : 'bg-ink-100 text-ink-400 hover:bg-ink-200 dark:bg-white/10 dark:hover:bg-white/15'
            }`}
        >
          <ThumbsUp className="w-4 h-4" strokeWidth={rated ? 2 : 1.75} fill={rated ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Card>
  )
}
