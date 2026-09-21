import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, User, Heart, Target, Brain } from 'lucide-react'
import { createContact, createRelation } from '../api/relations'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import { RELATION_TYPES, TONES, PLATFORMS } from '../lib/relationLabels'

const STEPS = [
  { key: 'contact', label: 'Contact', icon: User },
  { key: 'relation', label: 'Relation', icon: Heart },
  { key: 'goal', label: 'Objectif', icon: Target },
  { key: 'strategy', label: 'Stratégie', icon: Brain },
]

const STRATEGY_SUGGESTIONS = [
  { label: "Ne pas trop montrer mon intérêt", value: "Je ne veux pas paraître trop intéressé(e). Rester un peu mystérieux(se), ne pas répondre trop vite, montrer que j'ai une vie." },
  { label: "Jouer la carte de l'humour", value: "Utiliser beaucoup l'humour et la légèreté. Éviter les déclarations sérieuses trop tôt. Faire rire avant tout." },
  { label: 'Créer de la tension / mystère', value: "Alterner chaud et froid. Ne pas être toujours disponible. Créer un peu de tension et de curiosité." },
  { label: 'Montrer ma valeur', value: "Subtilement montrer que j'ai une vie intéressante, des passions, de l'ambition. Sans me vanter directement." },
  { label: 'Approche douce et sincère', value: "Être authentique et sincère. Pas de jeux. Montrer que je suis une personne de confiance et bienveillante." },
  { label: 'Flirt assumé', value: "Flirter ouvertement mais avec classe. Compliments directs, sous-entendus, montrer clairement mon intérêt." },
]

export default function NewRelationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [contact, setContact] = useState({ name: '', platform: 'whatsapp' })
  const [relation, setRelation] = useState({
    relation_type: 'romantic', tone: 'flirty', goal: '', backstory: '', strategy: '',
  })

  const contactMutation = useMutation({
    mutationFn: () => createContact(contact),
    onSuccess: () => setStep(3),
    onError: (err) => setErrors(err.response?.data || { general: 'Erreur lors de la création du contact.' }),
  })

  const relationMutation = useMutation({
    mutationFn: (contactId) => createRelation({ contact_id: contactId, ...relation }),
    onSuccess: (res) => navigate(`/relations/${res.data.id}`),
    onError: (err) => setErrors(err.response?.data || { general: 'Erreur lors de la création.' }),
  })

  const handleNext = () => {
    setErrors({})
    if (step === 0) {
      if (!contact.name.trim()) return setErrors({ name: 'Le prénom est requis.' })
      setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!relation.goal.trim()) return setErrors({ goal: "L'objectif est requis." })
      contactMutation.mutate()
    } else if (step === 3) {
      if (!relation.strategy.trim()) return setErrors({ strategy: 'Choisis ou décris une approche.' })
      relationMutation.mutate(contactMutation.data?.data?.id)
    }
  }

  const handleBack = () => {
    setErrors({})
    if (step === 0) navigate('/relations')
    else setStep((s) => s - 1)
  }

  const isLoading = contactMutation.isPending || relationMutation.isPending

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-ink-100 dark:hover:bg-white/10 transition">
          <ArrowLeft className="w-4 h-4 text-ink-600 dark:text-ink-300" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="font-display text-xl text-ink-950 dark:text-ink-50">Nouvelle relation</h1>
          <p className="text-xs text-ink-500">Étape {step + 1} sur {STEPS.length}</p>
        </div>
      </div>

      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-charmy-500' : 'bg-ink-100 dark:bg-white/10'}`} />
        ))}
      </div>

      {errors.general && <p className="text-sm text-danger text-center">{errors.general}</p>}

      {step === 0 && (
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg text-ink-950 dark:text-ink-50">C'est qui ?</h2>
            <p className="text-sm text-ink-500 mt-0.5">Parle-moi de la personne que tu veux mieux comprendre.</p>
          </div>
          <Input
            label="Prénom ou surnom"
            placeholder="Sophie, Alex..."
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            error={errors.name}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Plateforme principale</label>
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

      {step === 1 && (
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg text-ink-950 dark:text-ink-50">Quel type de lien ?</h2>
            <p className="text-sm text-ink-500 mt-0.5">Ça aide Charmy à calibrer ses conseils.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Type de relation</label>
            <div className="flex flex-col gap-2">
              {RELATION_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setRelation({ ...relation, relation_type: value })}
                  className={`flex items-center gap-3 py-3 px-4 rounded-2xl text-sm font-medium border text-left transition-colors
                    ${relation.relation_type === value
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
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Ton préféré</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(({ value, label }) => (
                <Chip key={value} selected={relation.tone === value} onClick={() => setRelation({ ...relation, tone: value })}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg text-ink-950 dark:text-ink-50">Ton objectif ?</h2>
            <p className="text-sm text-ink-500 mt-0.5">Plus c'est précis, mieux Charmy t'aide.</p>
          </div>
          <Textarea
            label="Qu'est-ce que tu veux accomplir ?"
            placeholder="Ex : Je veux qu'elle accepte de sortir avec moi, on se connaît depuis 2 semaines..."
            value={relation.goal}
            onChange={(e) => setRelation({ ...relation, goal: e.target.value })}
            rows={3}
            error={errors.goal}
          />
          <Textarea
            label="Historique (optionnel)"
            placeholder="Ex : On s'est rencontrés à une fête..."
            value={relation.backstory}
            onChange={(e) => setRelation({ ...relation, backstory: e.target.value })}
            rows={3}
          />
        </Card>
      )}

      {step === 3 && (
        <Card className="flex flex-col gap-3">
          <div>
            <h2 className="font-display text-lg text-ink-950 dark:text-ink-50">Ton approche ?</h2>
            <p className="text-sm text-ink-500 mt-0.5">
              Comment tu veux te comporter avec <span className="text-ink-800 dark:text-ink-200 font-medium">{contact.name}</span> ?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {STRATEGY_SUGGESTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setRelation({ ...relation, strategy: relation.strategy === value ? '' : value })}
                className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition-colors
                  ${relation.strategy === value
                    ? 'border-charmy-500 bg-charmy-50 text-charmy-600 dark:bg-charmy-950 dark:text-charmy-300'
                    : 'border-ink-200 dark:border-white/15 text-ink-700 dark:text-ink-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <Textarea
            label="Ou décris ta propre approche"
            placeholder="Ex : Je veux paraître occupé, répondre avec un peu de délai..."
            value={relation.strategy}
            onChange={(e) => setRelation({ ...relation, strategy: e.target.value })}
            rows={3}
            error={errors.strategy}
          />
        </Card>
      )}

      <Button onClick={handleNext} loading={isLoading}>
        {step === STEPS.length - 1 ? 'Créer la relation' : 'Continuer'}
      </Button>
    </div>
  )
}
