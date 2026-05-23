import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import SplashPage from './pages/SplashPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import RelationPage from './pages/RelationPage'
import NewRelationPage from './pages/NewRelationPage'
import EditRelationPage from './pages/EditRelationPage'
import CoachPage from './pages/CoachPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/layout/Layout'
import SplashRedirector from './components/SplashRedirector'
import PremiumPage from './pages/PremiumPage'
import PremiumSuccessPage from './pages/PremiumSuccessPage'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken)
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <SplashRedirector>
        <Routes>

        {/* Splash — point d'entrée */}
        <Route path="/splash" element={<SplashPage />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Onboarding — première connexion seulement */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />

        {/* App principale */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          // Routes publiques (hors Layout)
          <Route path="/premium/success" element={<PrivateRoute><PremiumSuccessPage /></PrivateRoute>} />

          // Dans les routes avec Layout
          <Route path="premium" element={<PremiumPage />} />
          <Route index element={<HomePage />} />
          <Route path="relations/new" element={<NewRelationPage />} />
          <Route path="relations/:id" element={<RelationPage />} />
          <Route path="relations/:id/edit" element={<EditRelationPage />} />
          <Route path="relations/:id/coach" element={<CoachPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect par défaut vers splash */}
        <Route path="*" element={<Navigate to="/splash" replace />} />

      </Routes>
      </SplashRedirector>
    </BrowserRouter>
  )
}