import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://charmy-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

// Injecter le token à chaque requête
api.interceptors.request.use((config) => {
  // Importer le store directement ici pour éviter les problèmes de circular import
  const storage = localStorage.getItem('charmy-auth')
  if (storage) {
    const { state } = JSON.parse(storage)
    if (state?.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`
    }
  }
  return config
})

// Refresh token si 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const storage = localStorage.getItem('charmy-auth')
        if (storage) {
          const { state } = JSON.parse(storage)
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'https://charmy-production.up.railway.app/api'}/auth/refresh/`,
            { refresh: state.refreshToken }
          )
          // Mettre à jour le store
          const parsed = JSON.parse(storage)
          parsed.state.accessToken = data.access
          localStorage.setItem('charmy-auth', JSON.stringify(parsed))
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        }
      } catch {
        localStorage.removeItem('charmy-auth')
        window.location.href = '/auth'
      }
    }
    return Promise.reject(error)
  }
)
export default api