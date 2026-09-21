import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink-950/40 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full md:max-w-sm bg-white dark:bg-ink-900 rounded-t-3xl md:rounded-3xl
          p-6 pb-8 md:pb-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto
          animate-fade-in-up shadow-soft-lg"
      >
        {title && (
          <div className="flex items-center justify-between -mt-1">
            <h3 className="font-display text-lg text-ink-950 dark:text-ink-50">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="p-1.5 -mr-1.5 rounded-full text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
