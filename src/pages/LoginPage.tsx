import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * Page de connexion.
 * Appelle POST /api/Auth/auth et redirige vers /app.
 */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [userAuth, setUserAuth] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ user_auth: userAuth, password })
      navigate('/app')
    } catch {
      setError('Identifiants incorrects. Vérifiez votre nom d\'utilisateur et mot de passe.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm">
        {/* Logo / titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Thiskord</h1>
          <p className="text-gray-400 mt-2 text-sm">Connectez-vous à votre espace</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nom d'utilisateur
            </label>
            <input
              className="input"
              type="text"
              value={userAuth}
              onChange={(e) => setUserAuth(e.target.value)}
              placeholder="EMRE"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Mot de passe
            </label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}