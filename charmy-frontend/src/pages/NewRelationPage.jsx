import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createContact, createRelation } from '../api/relations'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

const STEPS = ['Contact', 'Relation', 'Objectif', 'Stratégie']

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

const STRATEGY_SUGGESTIONS = [
  { emoji: '😎', label: 'Ne pas trop montrer mon intérêt', value: "Je ne veux pas paraître trop intéressé(e). Rester un peu mystérieux(se), ne pas répondre trop vite, montrer que j'ai une vie." },
  { emoji: '🎭', label: 'Jouer la carte de l\'humour', value: "Utiliser beaucoup l'humour et la légèreté. Eviter les déclarations sérieuses trop tôt. Faire rire avant tout." },
  { emoji: '🧲', label: 'Créer de la tension / mystère', value: "Alterner chaud et froid. Ne pas être toujours disponible. Créer un peu de tension et de curiosité." },
  { emoji: '💎', label: 'Montrer ma valeur', value: "Subtilement montrer que j'ai une vie intéressante, des passions, de l'ambition. Sans me vanter directement." },
  { emoji: '🕊️', label: 'Approche douce et sincère', value: "Être authentique et sincère. Pas de jeux. Montrer que je suis une personne de confiance et bienveillante." },
  { emoji: '🔥', label: 'Flirt assumé', value: "Flirter ouvertement mais avec classe. Compliments directs, sous-entendus, montrer clairement mon intérêt." },
]

const PLATFORMS = [
  { value: 'whatsapp', label: '💬 WhatsApp' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'sms', label: '📱 SMS' },
  { value: 'other', label: '🌐 Autre' },
]

export default function NewRelationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [contact, setContact] = useState({
    name: '',
    platform: 'whatsapp',
  })

  const [relation, setRelation] = useState({
    relation_type: 'romantic',
    tone: 'flirty',
    goal: '',
    backstory: '',
    strategy: '',
  })

  // Étape 1 — créer le contact
  const contactMutation = useMutation({
    mutationFn: () => createContact(contact),
    onSuccess: () => setStep(3),  // ← était setStep(2)
    onError: (err) => setErrors(err.response?.data || { general: 'Erreur lors de la création du contact.' }),
    })

  // Étape 2 — créer la relation
  const relationMutation = useMutation({
    mutationFn: (contactId) => createRelation({
      contact_id: contactId,
      ...relation,
    }),
    onSuccess: (res) => navigate(`/relations/${res.data.id}`),
    onError: (err) => setErrors(err.response?.data || { general: 'Erreur lors de la création.' }),
  })

  const handleNext = () => {
    setErrors({})

    if (step === 0) {
        if (!contact.name.trim()) {
        setErrors({ name: 'Le prénom est requis.' })
        return
        }
        setStep(1)
    } else if (step === 1) {
        setStep(2)
    } else if (step === 2) {
        if (!relation.goal.trim()) {
        setErrors({ goal: "L'objectif est requis." })
        return
        }
        contactMutation.mutate()  // ← on crée le contact ici
    } else if (step === 3) {
        if (!relation.strategy.trim()) {
        setErrors({ strategy: "Choisis ou décris une approche." })
        return
        }
        relationMutation.mutate(contactMutation.data?.data?.id)
    }
    }

  const handleBack = () => {
    setErrors({})
    if (step === 0) navigate('/')
    else setStep((s) => s - 1)
  }

  const isLoading = contactMutation.isPending || relationMutation.isPending

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Nouvelle relation
          </h1>
          <p className="text-xs text-gray-400">
            Étape {step + 1} sur {STEPS.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-charmy-500' : 'bg-gray-200 dark:bg-gray-800'
            }`}
          />
        ))}
      </div>

      {/* Erreur générale */}
      {errors.general && (
        <p className="text-sm text-red-500 text-center mb-4">{errors.general}</p>
      )}

      {/* ÉTAPE 0 — Infos contact */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="text-5xl mb-3">👤</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              C'est qui ?
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Parle-moi de la personne que tu veux charmer
            </p>
          </div>

          <Input
            label="Prénom ou surnom"
            placeholder="Sophie, Alex, Mon crush..."
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            error={errors.name}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plateforme principale
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setContact({ ...contact, platform: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border transition
                    ${contact.platform === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-charmy-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 1 — Type de relation & ton */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="text-5xl mb-3">💘</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quel type de lien ?
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Ça aide Charmy à calibrer ses conseils
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de relation
            </label>
            <div className="flex flex-col gap-2">
              {RELATION_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setRelation({ ...relation, relation_type: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition
                    ${relation.relation_type === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-charmy-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ton préféré
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setRelation({ ...relation, tone: value })}
                  className={`py-3 px-4 rounded-2xl text-sm font-medium border transition
                    ${relation.tone === value
                      ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-charmy-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Objectif & historique */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ton objectif ?
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Plus c'est précis, mieux Charmy t'aide
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Qu'est-ce que tu veux accomplir ?
            </label>
            <textarea
              placeholder="Ex: Je veux qu'elle accepte de sortir avec moi, on se connaît depuis 2 semaines sur Instagram..."
              value={relation.goal}
              onChange={(e) => setRelation({ ...relation, goal: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-900
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition
                ${errors.goal ? 'border-red-400' : ''}`}
            />
            {errors.goal && (
              <p className="text-xs text-red-500">{errors.goal}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Historique (optionnel)
            </label>
            <textarea
              placeholder="Ex: On s'est rencontrés à une fête, elle a ri à toutes mes blagues, on a échangé nos numéros..."
              value={relation.backstory}
              onChange={(e) => setRelation({ ...relation, backstory: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-900
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition"
            />
          </div>
        </div>
      )}
      {/* ÉTAPE 3 — Stratégie */}
        {step === 3 && (
        <div className="flex flex-col gap-4">
            <div className="text-center mb-2">
            <div className="text-5xl mb-3">🧠</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Ton approche ?
            </h2>
            <p className="text-sm text-gray-400 mt-1">
                Comment tu veux te comporter avec{' '}
                <span className="text-charmy-500 font-medium">{contact.name}</span> ?
            </p>
            </div>

            {/* Suggestions rapides */}
            <div className="flex flex-col gap-2">
            {STRATEGY_SUGGESTIONS.map(({ emoji, label, value }) => (
                <button
                key={value}
                onClick={() => setRelation({
                    ...relation,
                    strategy: relation.strategy === value ? '' : value
                })}
                className={`py-3 px-4 rounded-2xl text-sm font-medium border text-left transition flex items-center gap-3
                    ${relation.strategy === value
                    ? 'border-charmy-500 bg-charmy-50 text-charmy-500 dark:bg-charmy-950'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-charmy-300'
                    }`}
                >
                <span className="text-xl">{emoji}</span>
                <span>{label}</span>
                </button>
            ))}
            </div>

            {/* Ou écrire librement */}
            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ou décris ta propre approche :
            </label>
            <textarea
                placeholder="Ex: Je veux paraître occupé, répondre avec un peu de délai, ne jamais être le premier à proposer de se voir..."
                value={relation.strategy}
                onChange={(e) => setRelation({ ...relation, strategy: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border bg-gray-50 dark:bg-gray-900
                border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-charmy-400
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 resize-none text-sm transition"
            />
            </div>
        </div>
        )}
        

      {/* Bouton suivant */}
      <div className="mt-6">
        <Button onClick={handleNext} loading={isLoading}>
        {step === STEPS.length - 1 ? '🚀 Lancer Charmy' : 'Continuer →'}
        </Button>
      </div>
    </div>
  )
}