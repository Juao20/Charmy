import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { getRelation, updateRelation, updateContact } from '../api/relations'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import Tabs from '../components/ui/Tabs'
import { Skeleton } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'
import { RELATION_TYPES, TONES, PLATFORMS } from '../lib/relationLabels'

const STRATEGY_SUGGESTIONS = [
  { label: "Ne pas trop montrer mon intérêt", value: "Je ne veux pas paraître trop intéressé(e). Rester un peu mystérieux(se), ne pas répondre trop vite, montrer que j'ai une vie." },
  { label: "Jouer la carte de l'humour", value: "Utiliser beaucoup l'humour et la légèreté. Éviter les déclarations sérieuses trop tôt. Faire rire avant tout." },
  { label: 'Créer de la tension / mystère', value: "Alterner chaud et froid. Ne pas être toujours disponible. Créer un peu de tension et de curiosité." },
  { label: 'Montrer ma valeur', value: "Subtilement montrer que j'ai une vie intéressante, des passions, de l'ambition. Sans me vanter directement." },
  { label: 'Approche douce et sincère', value: "Être authentique et sincère. Pas de jeux. Montrer que je suis une personne de confiance et bienveillante." },
  { label: 'Flirt assumé', value: "Flirter ouvertement mais avec classe. Compliments directs, sous-entendus, montrer clairement mon intérêt." },
]

export default function EditRelationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { show } = useToast()
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('contact')

  const { data: relation, isLoading } = useQuery({
    queryKey: ['relation', id],
    queryFn: () => getRelation(id).then((r) => r.data),
  })

  const [contact, setContact] = useState({ name: '', platform: 'whatsapp' })
  const [relationData, setRelationData] = useState({
    relation_type: 'romantic', tone: 'flirty', goal: '', backstory: '', strategy: '',
  })

  const hydrated = useRef(false)
  useEffect(() => {
    if (relation && !hydrated.current) {
      hydrated.current = true
      setContact({ name: relation.contact.name, platform: relation.contact.platform })
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
    mutationFn: () => updateRelation(id, { ...relationData, contact_id: relation.contact.id }),
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
      show('Relation mise à jour.')
      navigate(`/relations/${id}`)
    } catch {
      show('Impossible de sauvegarder les modifications.', 'error')
    }
  }

  const saving = contactMutation.isPending || relationMutation.isPending

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(`/relations/${id}`)} className="p-2 -ml-2 rounded-full hover:bg-ink-100 dark:hover:bg-white/10 transition">
          <ArrowLeft className="w-4 h-4 text-ink-600 dark:text-ink-300" strokeWidth={1.75} />
        </button>
        <h1 className="font-display text-xl text-ink-950 dark:text-ink-50">Modifier la relation</h1>
      </div>

      <Tabs
        tabs={[
          { key: 'contact', label: 'Contact' },
          { key: 'relation', label: 'Relation' },
          { key: 'strategy', label: 'Stratégie' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

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
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Plateforme</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ value, label }) => (
                <Chip key={value} selected={contact.platform === value} onClick={() => setContact({ ...contact, platform: value })}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'relation' && (
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Type de relation</label>
            <div className="flex flex-col gap-2">
              {RELATION_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setRelationData({ ...relationData, relation_type: value })}
                  className={`flex items-center gap-3 py-3 px-4 rounded-2xl text-sm font-medium border text-left transition-colors
                    ${relationData.relation_type === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300'
                      : 'border-ink-200 dark:border-white/15 text-ink-700 dark:text-ink-300'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Ton</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(({ value, label }) => (
                <Chip key={value} selected={relationData.tone === value} onClick={() => setRelationData({ ...relationData, tone: value })}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          <Textarea
            label="Objectif"
            placeholder="Ce que tu veux accomplir..."
            value={relationData.goal}
            onChange={(e) => setRelationData({ ...relationData, goal: e.target.value })}
            rows={3}
            error={errors.goal}
          />

          <Textarea
            label="Historique (optionnel)"
            placeholder="Comment vous vous êtes rencontrés..."
            value={relationData.backstory}
            onChange={(e) => setRelationData({ ...relationData, backstory: e.target.value })}
            rows={3}
          />
        </Card>
      )}

      {activeTab === 'strategy' && (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-ink-500">
            Comment tu veux te comporter avec{' '}
            <span className="text-ink-800 dark:text-ink-200 font-medium">{contact.name}</span> ?
          </p>
          <div className="flex flex-col gap-2">
            {STRATEGY_SUGGESTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRelationData({ ...relationData, strategy: relationData.strategy === value ? '' : value })}
                className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition-colors
                  ${relationData.strategy === value
                    ? 'border-charmy-500 bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300'
                    : 'border-ink-200 dark:border-white/15 text-ink-700 dark:text-ink-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <Textarea
            label="Ou personnalise"
            placeholder="Décris ton approche..."
            value={relationData.strategy}
            onChange={(e) => setRelationData({ ...relationData, strategy: e.target.value })}
            rows={3}
          />
        </Card>
      )}

      <Button onClick={handleSave} loading={saving}>
        Sauvegarder les modifications
      </Button>
    </div>
  )
}
