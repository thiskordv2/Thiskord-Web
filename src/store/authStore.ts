import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  hydrate: () => void // Recharge depuis localStorage au démarrage
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    localStorage.setItem('thiskord_token', token)
    localStorage.setItem('thiskord_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('thiskord_token')
    localStorage.removeItem('thiskord_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  hydrate: () => {
    const token = localStorage.getItem('thiskord_token')
    const raw = localStorage.getItem('thiskord_user')
    if (token && raw) {
      try {
        const user: User = JSON.parse(raw)
        set({ user, token, isAuthenticated: true })
      } catch {
        // Données corrompues → on nettoie
        localStorage.removeItem('thiskord_token')
        localStorage.removeItem('thiskord_user')
      }
    }
  },
}))