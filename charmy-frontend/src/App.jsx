import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import RelationPage from './pages/RelationPage'
import NewRelationPage from './pages/NewRelationPage'
import CoachPage from './pages/CoachPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/layout/Layout'
import EditRelationPage from './pages/EditRelationPage'
function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken)
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="relations/:id" element={<RelationPage />} />
          <Route path="relations/:id/coach" element={<CoachPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="relations/new" element={<NewRelationPage />} />*
          <Route path="relations/:id/edit" element={<EditRelationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}