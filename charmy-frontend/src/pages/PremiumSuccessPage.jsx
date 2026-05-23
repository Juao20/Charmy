import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Button from '../components/ui/Button'

export default function PremiumSuccessPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Rafraîchir les données utilisateur
    queryClient.invalidateQueries(['me'])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-charmy-500 to-pink-500 flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="text-8xl animate-bounce">🎉</div>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenue dans Premium !
        </h1>
        <p className="text-white/80">
          Tu peux maintenant séduire sans limites avec Charmy.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="bg-white text-charmy-500 font-bold py-4 px-8 rounded-3xl shadow-lg hover:scale-[1.02] transition"
      >
        Commencer à charmer 🚀
      </button>
    </div>
  )
}