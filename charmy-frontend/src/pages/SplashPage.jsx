import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function SplashPage() {
  const navigate = useNavigate()
  const { accessToken, hasSeenOnboarding } = useAuthStore()

  useEffect(() => {
    sessionStorage.setItem('hasSeenSplashThisSession', 'true')

    const timer = setTimeout(() => {
      const targetPath = sessionStorage.getItem('charmy-target-path')
      sessionStorage.removeItem('charmy-target-path')

      if (!accessToken) {
        navigate('/auth')
      } else if (!hasSeenOnboarding) {
        navigate('/onboarding')
      } else if (targetPath && targetPath !== '/splash' && targetPath !== '/auth') {
        navigate(targetPath)
      } else {
        navigate('/')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [accessToken, hasSeenOnboarding, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-charmy-500 to-pink-500 flex flex-col items-center justify-center gap-6">

      {/* Logo animé */}
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="text-7xl">💘</div>
        <h1 className="text-4xl font-bold text-white tracking-wide">
          Charmy
        </h1>
        <p className="text-white/70 text-sm">
          Ton copilote de séduction
        </p>
      </div>

      {/* Loader */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            style={{
              animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
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