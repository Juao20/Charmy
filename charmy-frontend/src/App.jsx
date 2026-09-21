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
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import LandingPage from './pages/LandingPage'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken)
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <SplashRedirector>
        <Routes>

          {/* Splash */}
          <Route path="/splash" element={<SplashPage />} />

          {/* Landing page visible publiquement */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={
            <PrivateRoute><OnboardingPage /></PrivateRoute>
          } />

          {/* Pages publiques */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />

          {/* App principale avec Layout */}
          <Route path="/" element={
            <PrivateRoute><Layout /></PrivateRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="relations/new" element={<NewRelationPage />} />
            <Route path="relations/:id" element={<RelationPage />} />
            <Route path="relations/:id/edit" element={<EditRelationPage />} />
            <Route path="relations/:id/coach" element={<CoachPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Redirect par défaut */}
          <Route path="*" element={<Navigate to="/splash" replace />} />

        </Routes>
      </SplashRedirector>
    </BrowserRouter>
  )
}