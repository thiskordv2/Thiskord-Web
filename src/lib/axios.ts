/// <reference types="vite/client" />

import axios from 'axios'

// En dev : utilise le proxy Vite (vite.config.ts)
// En prod : utilise l'URL HTTPS du backend depuis .env
const apiUrl = (() => {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined
  return import.meta.env.PROD && apiBase ? `${apiBase}/api` : '/api'
})()

export const api = axios.create({
  baseURL: apiUrl,
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