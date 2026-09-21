import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login, register } from '../api/auth'
import useAuthStore from '../store/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Tabs from '../components/ui/Tabs'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    email: '', username: '', password: '', password2: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { setTokens, hasSeenOnboarding } = useAuthStore()

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((e2) => ({ ...e2, [e.target.name]: null }))
  }

  const loginMutation = useMutation({
    mutationFn: () => login({ username: form.email, password: form.password }),
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh)
      navigate(hasSeenOnboarding ? '/' : '/onboarding')
    },
    onError: () => setErrors({ general: 'Email ou mot de passe incorrect.' }),
  })

  const registerMutation = useMutation({
    mutationFn: () => register({
      email: form.email,
      username: form.username,
      password: form.password,
      password2: form.password2,
    }),
    onSuccess: () => {
      setIsLogin(true)
      setErrors({ general: 'Compte créé ! Connecte-toi.' })
    },
    onError: (err) => {
      setErrors(err.response?.data || { general: 'Une erreur est survenue.' })
    },
  })

  const handleSubmit = () => {
    isLogin ? loginMutation.mutate() : registerMutation.mutate()
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#17151a] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl text-ink-950 dark:text-ink-50">Charmy</h1>
          <p className="text-ink-500 text-sm mt-2 leading-relaxed max-w-[260px] mx-auto">
            Les bonnes conversations commencent parfois par les bons mots.
          </p>
        </div>

        <div className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4">
          <Tabs
            tabs={[{ key: 'login', label: 'Connexion' }, { key: 'register', label: 'Inscription' }]}
            active={isLogin ? 'login' : 'register'}
            onChange={(key) => setIsLogin(key === 'login')}
          />

          {errors.general && (
            <p className={`text-sm text-center ${errors.general.includes('créé') ? 'text-success' : 'text-danger'}`}>
              {errors.general}
            </p>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="toi@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          {!isLogin && (
            <Input
              label="Nom d'utilisateur"
              name="username"
              placeholder="tonpseudo"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />
          )}

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          {!isLogin && (
            <Input
              label="Confirmer le mot de passe"
              name="password2"
              type="password"
              placeholder="••••••••"
              value={form.password2}
              onChange={handleChange}
              error={errors.password2}
            />
          )}

          <Button onClick={handleSubmit} loading={isLoading} className="mt-1">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </Button>
        </div>
      </div>
    </div>
  )
}
