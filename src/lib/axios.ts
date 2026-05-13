import axios from 'axios'

// L'URL de base est proxifiée par Vite en dev (voir vite.config.ts)
// En production, remplacer par l'URL réelle du backend
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Injecte automatiquement le JWT dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thiskord_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gestion globale des erreurs : redirige vers /login si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('thiskord_token')
      localStorage.removeItem('thiskord_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)