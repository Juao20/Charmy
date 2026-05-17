import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRelation, updateRelation, updateContact } from '../api/relations'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

const RELATION_TYPES = [
  { value: 'romantic', label: '💕 Amour / Séduction' },
  { value: 'friendship', label: '👋 Amitié' },
  { value: 'professional', label: '💼 Professionnel' },
  { value: 'family', label: '👨‍👩‍👧 Famille' },
  { value: 'reconciliation', label: '🕊️ Réconciliation' },
]

const TONES = [
  { value: 'flirty', label: '😏 Flirty' },
  { value: 'playful', label: '😄 Joueur' },
  { value: 'tender', label: '🥰 Tendre' },
  { value: 'direct', label: '💬 Direct' },
  { value: 'formal', label: '👔 Formel' },
]

const PLATFORMS = [
  { value: 'whatsapp', label: '💬 WhatsApp' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'sms', label: '📱 SMS' },
  { value: 'other', label: '🌐 Autre' },
]

const STRATEGY_SUGGESTIONS = [
  { emoji: '😎', label: "Ne pas trop montrer mon intérêt", value: "Je ne veux pas paraître trop intéressé(e). Rester un peu mystérieux(se), ne pas répondre trop vite, montrer que j'ai une vie." },
  { emoji: '🎭', label: "Jouer la carte de l'humour", value: "Utiliser beaucoup l'humour et la légèreté. Eviter les déclarations sérieuses trop tôt. Faire rire avant tout." },
  { emoji: '🧲', label: 'Créer de la tension / mystère', value: "Alterner chaud et froid. Ne pas être toujours disponible. Créer un peu de tension et de curiosité." },
  { emoji: '💎', label: 'Montrer ma valeur', value: "Subtilement montrer que j'ai une vie intéressante, des passions, de l'ambition. Sans me vanter directement." },
  { emoji: '🕊️', label: 'Approche douce et sincère', value: "Être authentique et sincère. Pas de jeux. Montrer que je suis une personne de confiance et bienveillante." },
  { emoji: '🔥', label: 'Flirt assumé', value: "Flirter ouvertement mais avec classe. Compliments directs, sous-entendus, montrer clairement mon intérêt." },
]

export default function EditRelationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('contact')

  const { data: relation, isLoading } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const [contact, setContact] = useState({ name: '', platform: 'whatsapp' })
  const [relationData, setRelationData] = useState({
    relation_type: 'romantic',
    tone: 'flirty',
    goal: '',
    backstory: '',
    strategy: '',
  })

  // Pré-remplir les champs dès que les données sont chargées
  useEffect(() => {
    if (relation) {
      setContact({
        name: relation.contact.name,
        platform: relation.contact.platform,
      })
      setRelationData({
        relation_type: relation.relation_type,
        tone: relation.tone,
        goal: relation.goal,
        backstory: relation.backstory || '',
        strategy: relation.strategy || '',
      })
    }
  }, [relation])

  const contactMutation = useMutation({
    mutationFn: () => updateContact(relation.contact.id, contact),
    onError: (err) => setErrors(err.response?.data || {}),
  })

  const relationMutation = useMutation({
    mutationFn: () => updateRelation(id, {
      ...relationData,
      contact_id: relation.contact.id,
    }),
    onError: (err) => setErrors(err.response?.data || {}),
  })

  const handleSave = async () => {
    setErrors({})
    if (!contact.name.trim()) {
      setErrors({ name: 'Le prénom est requis.' })
      setActiveTab('contact')
      return
    }
    if (!relationData.goal.trim()) {
      setErrors({ goal: "L'objectif est requis." })
      setActiveTab('relation')
      return
    }

    try {
      await contactMutation.mutateAsync()
      await relationMutation.mutateAsync()
      queryClient.invalidateQueries(['relation', id])
      queryClient.invalidateQueries(['relations'])
      navigate(`/relations/${id}`)
    } catch {}
  }

  const isLoading2 = contactMutation.isPending || relationMutation.isPending

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin text-4xl">💘</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/relations/${id}`)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Modifier la relation
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-4">
        {[
          { key: 'contact', label: '👤 Contact' },
          { key: 'relation', label: '💘 Relation' },
          { key: 'strategy', label: '🧠 Stratégie' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition
              ${activeTab === key
                ? 'bg-white dark:bg-gray-700 text-charmy-500 shadow-sm'
                : 'text-gray-500'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Contact */}
      {activeTab === 'contact' && (
        <Card className="flex flex-col gap-4">
          <Input
            label="Prénom ou surnom"
            placeholder="Sophie, Alex..."
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            error={errors.name}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plateforme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setContact({ ...contact, platform: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border transition
                    ${contact.platform === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tab Relation */}
      {activeTab === 'relation' && (
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de relation
            </label>
            <div className="flex flex-col gap-2">
              {RELATION_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setRelationData({ ...relationData, relation_type: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition
                    ${relationData.relation_type === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ton
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setRelationData({ ...relationData, tone: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border transition
                    ${relationData.tone === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Objectif
            </label>
            <textarea
              value={relationData.goal}
              onChange={(e) => setRelationData({ ...relationData, goal: e.target.value })}
              rows={3}
              placeholder="Ce que tu veux accomplir..."
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition
                ${errors.goal ? 'border-red-400' : ''}`}
            />
            {errors.goal && <p className="text-xs text-red-500">{errors.goal}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Historique (optionnel)
            </label>
            <textarea
              value={relationData.backstory}
              onChange={(e) => setRelationData({ ...relationData, backstory: e.target.value })}
              rows={3}
              placeholder="Comment vous vous êtes rencontrés..."
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition"
            />
          </div>
        </Card>
      )}

      {/* Tab Stratégie */}
      {activeTab === 'strategy' && (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comment tu veux te comporter avec{' '}
            <span className="text-charmy-500 font-medium">{contact.name}</span> ?
          </p>
          {STRATEGY_SUGGESTIONS.map(({ emoji, label, value }) => (
            <button
              key={value}
              onClick={() => setRelationData({
                ...relationData,
                strategy: relationData.strategy === value ? '' : value
              })}
              className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition flex items-center gap-3
                ${relationData.strategy === value
                  ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
            >
              <span className="text-xl">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ou personnalise :
            </label>
            <textarea
              value={relationData.strategy}
              onChange={(e) => setRelationData({ ...relationData, strategy: e.target.value })}
              rows={3}
              placeholder="Décris ton approche..."
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-800
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition"
            />
          </div>
        </Card>
      )}

      {/* Bouton save */}
      <div className="mt-4">
        <Button onClick={handleSave} loading={isLoading2}>
          💾 Sauvegarder les modifications
        </Button>
      </div>
    </div>
  )
}