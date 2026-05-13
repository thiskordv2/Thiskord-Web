import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { stopConnection } from '@/lib/signalr'
import type { LoginRequest, RegisterRequest } from '@/types'

/**
 * Hook principal pour l'authentification.
 * Expose l'état et les actions login / logout / register.
 */
export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()

  const handleLogin = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    login(response.user, response.token)
    return response
  }

  const handleLogout = async () => {
    // Stoppe la connexion SignalR proprement avant de nettoyer le store
    await stopConnection()
    logout()
  }

  const handleRegister = async (data: RegisterRequest) => {
    return await authApi.register(data)
  }

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  }
}