import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="font-bold text-xl text-charmy-500">Charmy</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="bg-charmy-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Your AI Communication Coach
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Charmy helps you improve your communication skills and build
          meaningful relationships through personalized AI coaching.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-charmy-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-charmy-600 transition"
        >
          Start for free →
        </button>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: '🧠',
            title: 'AI-Powered Coaching',
            desc: 'Get personalized communication suggestions based on your goals and context.',
          },
          {
            icon: '🎯',
            title: 'Goal-Oriented',
            desc: 'Define your communication objectives and let Charmy guide your strategy.',
          },
          {
            icon: '📈',
            title: 'Track Progress',
            desc: 'Monitor your communication improvements with detailed relationship insights.',
          },
          {
            icon: '💬',
            title: 'Real-Time Coach',
            desc: 'Paste any conversation and get instant AI analysis and suggestions.',
          },
          {
            icon: '🔒',
            title: 'Private & Secure',
            desc: 'Your conversations are encrypted and never shared with third parties.',
          },
          {
            icon: '⚡',
            title: 'Instant Results',
            desc: 'Get 3 tailored message suggestions in seconds powered by advanced AI.',
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-gray-500 mb-8">Start free, upgrade when you're ready</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Free',
              price: '€0',
              period: 'forever',
              features: ['2 sessions/day', '2 suggestions per session', 'Basic strategies'],
            },
            {
              name: 'Premium Monthly',
              price: '€12.99',
              period: '/month',
              features: ['Unlimited sessions', 'All 3 suggestions', 'Full history', 'All strategies'],
              highlight: true,
            },
            {
              name: 'Yearly',
              price: '€89.99',
              period: '/year',
              features: ['Everything in Monthly', 'Save 42%', 'Priority support'],
            },
          ].map(({ name, price, period, features, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl p-6 border-2 text-left ${
                highlight
                  ? 'border-charmy-500 bg-charmy-50 dark:bg-charmy-950'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <h3 className="font-bold text-gray-900 dark:text-white">{name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-charmy-500">{price}</span>
                <span className="text-gray-400 text-sm ml-1">{period}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="text-charmy-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer avec liens légaux */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-400">© 2026 Charmy. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/terms" className="text-sm text-gray-400 hover:text-charmy-500">Terms</a>
            <a href="/privacy" className="text-sm text-gray-400 hover:text-charmy-500">Privacy</a>
            <a href="/refund" className="text-sm text-gray-400 hover:text-charmy-500">Refund</a>
          </div>
        </div>
      </footer>

    </div>
  )
}