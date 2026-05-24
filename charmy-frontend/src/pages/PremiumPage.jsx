import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createCheckoutSession, createPortalSession, getMe } from '../api/auth'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '€12.99',
    period: '/mois',
    description: 'Parfait pour commencer',
    badge: null,
    features: [
      'Suggestions illimitées',
      'Coach IA temps réel',
      'Toutes les stratégies',
      'Historique complet',
    ],
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '€89.99',
    period: '/an',
    description: 'Économise 42%',
    badge: '🔥 Meilleure offre',
    features: [
      'Tout du plan mensuel',
      '2 mois offerts',
      'Simulateur de conversation',
      'Support prioritaire',
    ],
  },
  {
    id: 'pack',
    label: 'Pack Situations',
    price: '€6.99',
    period: 'one-shot',
    description: 'Paiement unique',
    badge: null,
    features: [
      '50 suggestions',
      'Toutes les stratégies',
      'Valable sans limite de temps',
      'Idéal pour tester',
    ],
  },
]
export default function PremiumPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('yearly')

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then((r) => r.data),
  })

  const checkoutMutation = useMutation({
    mutationFn: (plan) => createCheckoutSession(plan),
    onSuccess: (res) => {
      window.location.href = res.data.checkout_url
    },
  })

  const portalMutation = useMutation({
    mutationFn: createPortalSession,
    onSuccess: (res) => {
      window.location.href = res.data.portal_url
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 max-w-md mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Passer à Premium
        </h1>
      </div>

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">✨</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Charmy Premium
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Séduire sans limites, avec style
        </p>
      </div>

      {/* Si déjà premium */}
      {user?.is_premium ? (
        <Card className="text-center flex flex-col gap-4">
          <div className="text-4xl">👑</div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Tu es déjà Premium !
            </h3>
            {user.premium_until && (
              <p className="text-sm text-gray-400 mt-1">
                Valable jusqu'au{' '}
                {new Date(user.premium_until).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
          </div>
          <Button
            onClick={() => portalMutation.mutate()}
            loading={portalMutation.isPending}
            variant="outline"
          >
            Gérer mon abonnement
          </Button>
        </Card>
      ) : (
        <>
          {/* Plans */}
          <div className="flex flex-col gap-3 mb-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-3xl border-2 p-4 cursor-pointer transition-all
                  ${selected === plan.id
                    ? 'border-charmy-500 bg-charmy-50 dark:bg-charmy-950'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-4 bg-charmy-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {plan.label}
                    </h3>
                    <p className="text-xs text-gray-400">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-charmy-500">
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-1.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-charmy-500 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Indicateur sélection */}
                {selected === plan.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-charmy-500 flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          // Sur fond blanc → variant primary (texte blanc sur fond charmy)
            <Button onClick={() => checkoutMutation.mutate(selected)} loading={checkoutMutation.isPending}>
            💳 Continuer avec {PLANS.find(p => p.id === selected)?.price}
            </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Paiement sécurisé par Stripe · Annulation à tout moment
          </p>
        </>
      )}
    </div>
  )
}