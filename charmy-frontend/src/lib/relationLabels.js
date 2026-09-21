import { Heart, Users, Briefcase, Home, HeartHandshake, Flag, AlertTriangle, Sparkles, FileText } from 'lucide-react'

export const RELATION_TYPES = [
  { value: 'romantic', label: 'Amour / Séduction', icon: Heart },
  { value: 'friendship', label: 'Amitié', icon: Users },
  { value: 'professional', label: 'Professionnel', icon: Briefcase },
  { value: 'family', label: 'Famille', icon: Home },
  { value: 'reconciliation', label: 'Réconciliation', icon: HeartHandshake },
]

export const RELATION_TYPE_MAP = Object.fromEntries(RELATION_TYPES.map((t) => [t.value, t]))

export const TONES = [
  { value: 'flirty', label: 'Flirty' },
  { value: 'playful', label: 'Joueur' },
  { value: 'tender', label: 'Tendre' },
  { value: 'direct', label: 'Direct' },
  { value: 'formal', label: 'Formel' },
]

export const TONE_MAP = Object.fromEntries(TONES.map((t) => [t.value, t.label]))

export const PLATFORMS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'sms', label: 'SMS' },
  { value: 'other', label: 'Autre' },
]

export const EVENT_TYPES = [
  { value: 'milestone', label: 'Étape importante', icon: Flag, tone: 'primary' },
  { value: 'conflict', label: 'Conflit', icon: AlertTriangle, tone: 'danger' },
  { value: 'positive', label: 'Moment positif', icon: Sparkles, tone: 'success' },
  { value: 'note', label: 'Note libre', icon: FileText, tone: 'neutral' },
]

export const EVENT_TYPE_MAP = Object.fromEntries(EVENT_TYPES.map((t) => [t.value, t]))

export const OBJECTIVES = [
  'Créer du rapprochement',
  'Clarifier une situation',
  "S'excuser",
  'Relancer la conversation',
  'Poser une limite',
  'Autre',
]

export function getTimeAgo(date) {
  if (!date) return null
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `il y a ${days}j`
  if (hours > 0) return `il y a ${hours}h`
  if (mins > 0) return `il y a ${mins}min`
  return "à l'instant"
}
