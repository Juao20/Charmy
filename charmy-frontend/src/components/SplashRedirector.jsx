import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const PUBLIC_ROUTES = ['/landing', '/terms', '/privacy', '/refund', '/auth', '/splash']

export default function SplashRedirector({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))
    
    if (isPublic) return

    const hasShownSplash = sessionStorage.getItem('splash-shown')
    if (!hasShownSplash) {
      sessionStorage.setItem('splash-shown', 'true')
      navigate('/splash', { replace: true })
    }
  }, [])

  return children
}