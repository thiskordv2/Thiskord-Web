import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Pages
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AppPage from '../pages/AppPage'
import InvitePage from '../pages/InvitePage'
import ProfilePage from '../pages/ProfilePage'
import NotFoundPage from '../pages/NotFoundPage'

/**
 * Guard : redirige vers /login si non authentifié.
 */
function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Guard inverse : redirige vers /app si déjà connecté.
 */
function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to="/app" replace />
}

export function AppRouter() {
  const hydrate = useAuthStore((s) => s.hydrate)

  // Recharge l'état auth depuis localStorage au montage initial
  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Routes privées */}
      <Route element={<PrivateRoute />}>
        <Route path="/app" element={<AppPage />} />
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Redirections */}
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}