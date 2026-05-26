import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function SplashPage() {
  const navigate = useNavigate()
  const { accessToken, hasSeenOnboarding } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true)
      if (!accessToken) {
        navigate('/auth')
      } else if (!hasSeenOnboarding) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-charmy-500 to-pink-500 flex flex-col">

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="text-7xl">💬</div>
        <h1 className="text-4xl font-bold text-white">Charmy</h1>
        <p className="text-white/80 text-lg max-w-xs">
          Your AI communication coach for better conversations
        </p>
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      {/* Features visibles publiquement */}
      <div className="px-8 pb-12 flex flex-col gap-3">
        {[
          { icon: '🧠', text: 'AI-powered conversation coaching' },
          { icon: '🎯', text: 'Personalized communication strategies' },
          { icon: '📈', text: 'Build meaningful relationships' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-white/20 rounded-2xl px-4 py-3">
            <span className="text-xl">{icon}</span>
            <span className="text-white text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}