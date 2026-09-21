import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function SplashPage() {
  const navigate = useNavigate()
  const { accessToken, hasSeenOnboarding } = useAuthStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!accessToken) navigate('/auth')
      else if (!hasSeenOnboarding) navigate('/onboarding')
      else navigate('/')
    }, 1400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#17151a] flex flex-col items-center justify-center px-8 gap-6">
      <h1 className="font-display text-4xl text-ink-950 dark:text-ink-50">Charmy</h1>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-charmy-400"
            style={{ animation: `pulse-soft 1s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}
