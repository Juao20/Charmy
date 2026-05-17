import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login, register } from '../api/auth'
import useAuthStore from '../store/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    email: '', username: '', password: '', password2: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((e2) => ({ ...e2, [e.target.name]: null }))
  }

  const loginMutation = useMutation({
    mutationFn: () => login({ username: form.email, password: form.password }),
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh)
      navigate('/')
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
    <div className="min-h-screen bg-gradient-to-br from-charmy-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="text-6xl mb-3">💘</div>
        <h1 className="text-3xl font-bold text-charmy-500">Charmy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Ton copilote de séduction
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 flex flex-col gap-4">

        {/* Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {['Connexion', 'Inscription'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setIsLogin(i === 0)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition
                ${(isLogin ? i === 0 : i === 1)
                  ? 'bg-white dark:bg-gray-700 text-charmy-500 shadow-sm'
                  : 'text-gray-500'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Message général */}
        {errors.general && (
          <p className={`text-sm text-center ${
            errors.general.includes('créé')
              ? 'text-green-500'
              : 'text-red-500'
          }`}>
            {errors.general}
          </p>
        )}

        {/* Champs */}
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

        <Button onClick={handleSubmit} loading={isLoading}>
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </Button>
      </div>
    </div>
  )
}