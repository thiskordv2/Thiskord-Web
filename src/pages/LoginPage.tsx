import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LogIn } from 'lucide-react'

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)',
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div
        className="w-full max-w-sm relative z-10"
        style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Logo / titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient">Thiskord</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Connectez-vous à votre espace
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card space-y-5"
          style={{
            boxShadow: '0 16px 64px rgba(0,0,0,0.3), 0 0 80px rgba(139,92,246,0.05)',
          }}
        >
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
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
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
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
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                color: 'var(--color-status-error)',
                background: 'rgba(248, 113, 113, 0.08)',
                border: '1px solid rgba(248, 113, 113, 0.15)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <LogIn className="w-4 h-4" />
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted)' }}>
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="font-medium transition-colors duration-200"
            style={{ color: 'var(--color-accent-violet-light)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-accent-violet-light)' }}
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}