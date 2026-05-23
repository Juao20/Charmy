import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SplashRedirector({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplashThisSession')
    if (!hasSeenSplash && location.pathname !== '/splash') {
      sessionStorage.setItem('charmy-target-path', location.pathname + location.search)
      navigate('/splash', { replace: true })
    }
  }, [location, navigate])

  return children
}
