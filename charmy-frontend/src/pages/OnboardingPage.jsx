import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const SLIDES = [
  {
    emoji: '💘',
    title: 'Bienvenue sur Charmy',
    description:
      "L'IA qui t'aide à mener tes conversations amoureuses avec style, charme et stratégie.",
    bg: 'from-charmy-500 to-pink-500',
  },
  {
    emoji: '🧠',
    title: 'Ton coach personnel',
    description:
      'Colle une conversation, décris ton objectif — Charmy génère 3 messages calibrés pour séduire, reconquérir ou charmer.',
    bg: 'from-purple-500 to-charmy-500',
  },
  {
    emoji: '🎯',
    title: 'Stratégie sur mesure',
    description:
      "Définit ton approche : mystérieux, flirty, tendre... Charmy adapte chaque message à ta façon d'être.",
    bg: 'from-pink-500 to-orange-400',
  },
]

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const { setOnboardingDone } = useAuthStore()

  const isLast = current === SLIDES.length - 1

  const handleNext = () => {
    if (isLast) {
      setOnboardingDone()
      navigate('/')
    } else {
      setCurrent((c) => c + 1)
    }
  }

  const handleSkip = () => {
    setOnboardingDone()
    navigate('/')
  }

  const slide = SLIDES[current]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${slide.bg} flex flex-col transition-all duration-500`}
    >
      {/* Skip */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-white/70 text-sm font-medium hover:text-white transition"
        >
          Passer →
        </button>
      </div>

      {/* Contenu slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div
          key={current}
          className="flex flex-col items-center gap-6"
          style={{ animation: 'fadeSlide 0.4s ease-out' }}
        >
          <div className="text-8xl">{slide.emoji}</div>
          <h2 className="text-3xl font-bold text-white leading-tight">
            {slide.title}
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-xs">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-8 flex flex-col items-center gap-6">

        {/* Indicateurs de slide */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Bouton suivant */}
        <button
          onClick={handleNext}
          className="w-full max-w-xs bg-white text-charmy-500 font-bold py-4 rounded-3xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          {isLast ? '🚀 Commencer à charmer' : 'Continuer →'}
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}