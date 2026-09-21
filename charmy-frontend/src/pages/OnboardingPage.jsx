import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Brain, Target } from 'lucide-react'
import useAuthStore from '../store/authStore'
import Button from '../components/ui/Button'

const SLIDES = [
  {
    icon: MessageCircle,
    title: 'Bienvenue sur Charmy',
    description: "L'IA qui t'aide à mener tes conversations importantes avec style et justesse.",
  },
  {
    icon: Brain,
    title: 'Ton coach personnel',
    description: 'Décris une situation, Charmy analyse le contexte et te propose 3 messages calibrés.',
  },
  {
    icon: Target,
    title: 'Sur mesure',
    description: "Définis ton approche : mystérieux, direct, tendre... Charmy s'adapte à ta façon d'être.",
  },
]

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const { setOnboardingDone } = useAuthStore()

  const isLast = current === SLIDES.length - 1
  const slide = SLIDES[current]
  const Icon = slide.icon

  const finish = () => { setOnboardingDone(); navigate('/') }
  const handleNext = () => isLast ? finish() : setCurrent((c) => c + 1)

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#17151a] flex flex-col">
      <div className="flex justify-end p-6">
        <button onClick={finish} className="text-ink-400 text-sm font-medium hover:text-ink-600 dark:hover:text-ink-200 transition">
          Passer
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div key={current} className="flex flex-col items-center gap-6 animate-fade-in-up">
          <div className="w-16 h-16 rounded-3xl bg-charmy-50 dark:bg-charmy-950 flex items-center justify-center">
            <Icon className="w-7 h-7 text-charmy-500" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-2xl text-ink-950 dark:text-ink-50 leading-tight">{slide.title}</h2>
          <p className="text-ink-500 text-[15px] leading-relaxed max-w-xs">{slide.description}</p>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Aller à l'étape ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-charmy-500' : 'w-1.5 h-1.5 bg-ink-200 dark:bg-white/20'}`}
            />
          ))}
        </div>
        <Button onClick={handleNext} className="max-w-xs">
          {isLast ? 'Commencer' : 'Continuer'}
        </Button>
      </div>
    </div>
  )
}
